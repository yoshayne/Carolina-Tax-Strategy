import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { z } from "zod";
import Redis from "ioredis";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { query, initSchema } from "./db";
import { getValidAccessToken, createCalendarEventOAuth } from "./google";
import { sendBookingEmails, sendIntakeEmails, sendEmail, brevoConfigured } from "./email";
import { getSettings, saveSettings, DEFAULT_SETTINGS, BookingSettings } from "./settings";
import { getWeekAvailability } from "./availability";

const app = new Hono();

// ---- Redis (optional) ----
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, lazyConnect: false });
    redis.on("error", (e) => console.error("Redis error:", e.message));
  } catch (e) {
    console.error("Failed to init Redis:", e);
  }
}

// Rate limit: max `limit` requests per `windowSec` per IP. Fails open.
async function rateLimit(ip: string, key: string, limit = 5, windowSec = 3600): Promise<boolean> {
  if (!redis) return true;
  try {
    const k = `rl:${key}:${ip}`;
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, windowSec);
    return count <= limit;
  } catch {
    return true;
  }
}

function clientIp(c: any): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

function appBaseUrl(c: any): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

// ==================== STATIC FRONTEND (before API) ====================
// Compiled server lives in dist-server/; frontend build is in dist/ (sibling).
const distCandidates = [
  join(__dirname, "../../dist"), // dist-server/server -> code/dist
  join(__dirname, "../dist"),
  join(process.cwd(), "dist"),
];
const distDir = distCandidates.find((p) => existsSync(p)) || join(process.cwd(), "dist");

app.use("/assets/*", serveStatic({ root: distDir }));
// Serve any top-level static file (logo.png, hero.png, favicon, etc.)
app.use("/*", serveStatic({ root: distDir }));

// ==================== PUBLIC API ====================

const appointmentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  annualRevenue: z.string().optional().nullable(),
  primaryGoal: z.string().optional().nullable(),
  appointmentDate: z.string().min(1),
  appointmentTime: z.string().min(1),
});

app.post("/api/appointments", async (c) => {
  if (!(await rateLimit(clientIp(c), "appt"))) {
    return c.json({ error: "Too many requests. Please try again later." }, 429);
  }
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Missing or invalid required fields", details: parsed.error.flatten() }, 400);
  }
  const a = parsed.data;

  const { rows } = await query<{ id: number }>(
    `INSERT INTO appointments
      (first_name, last_name, email, phone, business_type, annual_revenue, primary_goal, appointment_date, appointment_time)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [a.firstName, a.lastName, a.email, a.phone || null, a.businessType || null, a.annualRevenue || null, a.primaryGoal || null, a.appointmentDate, a.appointmentTime]
  );
  const appointmentId = rows[0].id;

  // Google Calendar event (best-effort)
  let calendarEventId: string | null = null;
  try {
    const token = await getValidAccessToken();
    if (token) {
      const settings = await getSettings();
      calendarEventId = await createCalendarEventOAuth(token.accessToken, token.calendarId, a, settings.appointmentLength);
      if (calendarEventId) {
        await query("UPDATE appointments SET google_calendar_event_id = $1 WHERE id = $2", [calendarEventId, appointmentId]);
      }
    }
  } catch (err) {
    console.error("Calendar event creation failed:", err);
  }

  // Emails (best-effort, never blocks/fails request)
  sendBookingEmails(a).catch((e) => console.error("booking email error:", e));

  return c.json({ success: true, appointmentId, calendarEventId });
});

const intakeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  filingStatus: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  incomeSources: z.array(z.string()).default([]),
  complexityFlags: z.array(z.string()).default([]),
  estimateMin: z.number().int().optional().nullable(),
  estimateMax: z.number().int().optional().nullable(),
  wantsPremium: z.boolean().optional().default(false),
});

app.post("/api/intake", async (c) => {
  if (!(await rateLimit(clientIp(c), "intake"))) {
    return c.json({ error: "Too many requests. Please try again later." }, 429);
  }
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid fields", details: parsed.error.flatten() }, 400);
  }
  const l = parsed.data;

  const { rows } = await query<{ id: number }>(
    `INSERT INTO intake_leads
      (first_name, last_name, email, phone, filing_status, state, income_sources, complexity_flags, estimate_min, estimate_max, wants_premium)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [l.firstName, l.lastName, l.email, l.phone || null, l.filingStatus || null, l.state || null,
     l.incomeSources.join(","), l.complexityFlags.join(","), l.estimateMin ?? null, l.estimateMax ?? null, !!l.wantsPremium]
  );
  const leadId = rows[0].id;

  sendIntakeEmails({
    firstName: l.firstName, lastName: l.lastName, email: l.email, phone: l.phone || undefined,
    filingStatus: l.filingStatus || undefined, state: l.state || undefined,
    incomeSources: l.incomeSources, complexityFlags: l.complexityFlags,
    estimateMin: l.estimateMin ?? 0, estimateMax: l.estimateMax ?? 0, wantsPremium: !!l.wantsPremium,
  }).catch((e) => console.error("intake email error:", e));

  return c.json({ success: true, leadId });
});

app.get("/api/availability", async (c) => {
  const weekStart = c.req.query("weekStart");
  if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    return c.json({ error: "weekStart=YYYY-MM-DD required" }, 400);
  }
  try {
    const result = await getWeekAvailability(weekStart, redis);
    return c.json(result);
  } catch (err) {
    console.error("availability error:", err);
    return c.json({ days: [] });
  }
});

app.get("/api/calendar/test", async (c) => {
  try {
    const token = await getValidAccessToken();
    if (!token) return c.json({ success: false, error: "No calendar connected. Please connect via /admin" }, 400);
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(token.calendarId)}`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );
    if (!response.ok) {
      return c.json({ success: false, error: `Calendar API error: ${response.status}`, details: await response.text() }, 400);
    }
    const info = (await response.json()) as { summary: string; id: string };
    return c.json({ success: true, message: "Calendar connection successful!", calendar: { name: info.summary, id: info.id } });
  } catch (error) {
    return c.json({ success: false, error: `Connection failed: ${error instanceof Error ? error.message : "Unknown"}` }, 500);
  }
});

// ==================== ADMIN AUTH ====================

const DEFAULT_ADMIN_PASSWORD = "123456";
const SESSION_TTL = 60 * 60 * 24; // 24 hours
const SESSION_COOKIE = "cts_admin_session";

// In-memory session store (fallback when Redis unavailable)
const localSessions = new Set<string>();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const candidate = scryptSync(password, salt, 32);
    return timingSafeEqual(Buffer.from(hash, "hex"), candidate);
  } catch {
    return false;
  }
}

async function getAdminPasswordHash(): Promise<string> {
  const { rows } = await query<{ value: string }>("SELECT value FROM settings WHERE key = $1", ["admin_password"]);
  if (rows.length && rows[0].value) return rows[0].value;
  // First boot: store hashed default
  const hashed = hashPassword(DEFAULT_ADMIN_PASSWORD);
  await query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", ["admin_password", hashed]);
  return hashed;
}

async function createSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  if (redis) {
    await redis.set(`session:${token}`, "1", "EX", SESSION_TTL);
  } else {
    localSessions.add(token);
    setTimeout(() => localSessions.delete(token), SESSION_TTL * 1000);
  }
  return token;
}

async function validateSession(token: string): Promise<boolean> {
  if (!token) return false;
  if (redis) {
    const val = await redis.get(`session:${token}`);
    return val === "1";
  }
  return localSessions.has(token);
}

async function destroySession(token: string): Promise<void> {
  if (redis) await redis.del(`session:${token}`);
  else localSessions.delete(token);
}

function getSessionToken(c: { req: { header: (name: string) => string | undefined } }): string {
  const cookieHeader = c.req.header("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : "";
}

function setSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL}; SameSite=Lax`;
}

function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

// Public auth endpoints (no session required)
app.post("/api/admin/login", async (c) => {
  const { password } = (await c.req.json()) as { password?: string };
  if (!password) return c.json({ success: false, error: "Password required" }, 400);
  const stored = await getAdminPasswordHash();
  if (!verifyPassword(password, stored)) return c.json({ success: false, error: "Incorrect password" }, 401);
  const token = await createSession();
  c.header("Set-Cookie", setSessionCookie(token));
  return c.json({ success: true });
});

app.post("/api/admin/logout", async (c) => {
  const token = getSessionToken(c);
  if (token) await destroySession(token);
  c.header("Set-Cookie", clearSessionCookie());
  return c.json({ success: true });
});

app.get("/api/admin/auth-status", async (c) => {
  const token = getSessionToken(c);
  const authenticated = await validateSession(token);
  return c.json({ authenticated });
});

// Admin auth middleware — protects all /api/admin/* except the three above
async function adminAuth(c: Parameters<Parameters<typeof app.use>[1]>[0], next: () => Promise<void>) {
  const path = new URL(c.req.url).pathname;
  const open = ["/api/admin/login", "/api/admin/logout", "/api/admin/auth-status", "/api/admin/auth/google/callback"];
  if (open.some((p) => path === p || path.startsWith(p))) return next();
  const token = getSessionToken(c);
  if (!(await validateSession(token))) return c.json({ error: "Unauthorized" }, 401);
  return next();
}

app.use("/api/admin/*", adminAuth);

// Change password (requires valid session, enforced by middleware above)
app.post("/api/admin/change-password", async (c) => {
  const { oldPassword, newPassword } = (await c.req.json()) as { oldPassword?: string; newPassword?: string };
  if (!oldPassword || !newPassword) return c.json({ success: false, error: "Both passwords required" }, 400);
  if (newPassword.length < 6) return c.json({ success: false, error: "New password must be at least 6 characters" }, 400);
  const stored = await getAdminPasswordHash();
  if (!verifyPassword(oldPassword, stored)) return c.json({ success: false, error: "Current password is incorrect" }, 401);
  const hashed = hashPassword(newPassword);
  await query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", ["admin_password", hashed]);
  return c.json({ success: true });
});

// ==================== GOOGLE CALENDAR OAUTH ====================

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email";

function buildGoogleAuthUrl(clientId: string, redirectUri: string): string {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GOOGLE_SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  return authUrl.toString();
}

async function persistTokens(tokenData: { access_token: string; refresh_token?: string; expires_in: number }, calendarInfo: { id: string; summary: string }, userEmail: string) {
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
  await query("DELETE FROM google_oauth_tokens");
  await query(
    `INSERT INTO google_oauth_tokens (access_token, refresh_token, expires_at, calendar_id, calendar_name, user_email)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [tokenData.access_token, tokenData.refresh_token || null, expiresAt, calendarInfo.id, calendarInfo.summary, userEmail]
  );
}

app.get("/api/admin/auth/google/url", (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return c.json({ error: "GOOGLE_CLIENT_ID not configured" }, 400);
  const redirectUri = `${appBaseUrl(c)}/admin/google-callback`;
  return c.json({ url: buildGoogleAuthUrl(clientId, redirectUri), redirectUri });
});

app.post("/api/admin/auth/google/exchange", async (c) => {
  const { code } = (await c.req.json()) as { code: string };
  if (!code) return c.json({ error: "No authorization code provided" }, 400);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return c.json({ error: "OAuth not configured" }, 400);
  const redirectUri = `${appBaseUrl(c)}/admin/google-callback`;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });
    const tokenData = (await tokenResponse.json()) as { access_token: string; refresh_token?: string; expires_in: number; error?: string; error_description?: string };
    if (tokenData.error) return c.json({ error: tokenData.error_description || tokenData.error }, 400);

    const userInfo = (await (await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${tokenData.access_token}` } })).json()) as { email: string };
    const calendarInfo = (await (await fetch("https://www.googleapis.com/calendar/v3/calendars/primary", { headers: { Authorization: `Bearer ${tokenData.access_token}` } })).json()) as { id: string; summary: string };

    await persistTokens(tokenData, calendarInfo, userInfo.email);
    return c.json({ success: true, calendarId: calendarInfo.id, calendarName: calendarInfo.summary, email: userInfo.email });
  } catch (err) {
    return c.json({ error: `Failed to connect: ${err instanceof Error ? err.message : "Unknown"}` }, 500);
  }
});

app.get("/api/admin/auth/google", (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return c.html(`<html><body style="font-family:system-ui;padding:40px;text-align:center;"><h1 style="color:#dc2626;">Configuration Error</h1><p>Set GOOGLE_CLIENT_ID.</p><a href="/admin">Back to Admin</a></body></html>`, 400);
  }
  const redirectUri = `${appBaseUrl(c)}/admin/google-callback`;
  return c.redirect(buildGoogleAuthUrl(clientId, redirectUri));
});

app.get("/api/admin/auth/google/callback", async (c) => {
  const htmlResponse = (content: string) =>
    c.html(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Calendar OAuth</title></head><body style="font-family:system-ui,sans-serif;padding:40px;max-width:600px;margin:0 auto;">${content}</body></html>`);

  const code = c.req.query("code");
  const error = c.req.query("error");
  if (error) {
    return htmlResponse(`<h1 style="color:#dc2626;">Authorization Failed</h1><p>Error: ${error}</p><script>if(window.opener){window.opener.postMessage({type:'google-calendar-connected',success:false,error:'${error}'},'*');setTimeout(()=>window.close(),2000);}</script>`);
  }
  if (!code) return htmlResponse(`<h1 style="color:#dc2626;">Error</h1><p>No authorization code received</p><a href="/admin">Back to Admin</a>`);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return htmlResponse(`<h1 style="color:#dc2626;">Error</h1><p>OAuth not configured</p>`);

  const redirectUri = `${appBaseUrl(c)}/api/admin/auth/google/callback`;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });
    const tokenData = (await tokenResponse.json()) as { access_token: string; refresh_token?: string; expires_in: number; error?: string; error_description?: string };
    if (tokenData.error) return htmlResponse(`<h1 style="color:#dc2626;">Error</h1><p>${tokenData.error_description || tokenData.error}</p>`);

    const userInfo = (await (await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${tokenData.access_token}` } })).json()) as { email: string };
    const calendarInfo = (await (await fetch("https://www.googleapis.com/calendar/v3/calendars/primary", { headers: { Authorization: `Bearer ${tokenData.access_token}` } })).json()) as { id: string; summary: string };
    await persistTokens(tokenData, calendarInfo, userInfo.email);

    return htmlResponse(`<div style="text-align:center;"><h1 style="color:#059669;">✓ Calendar Connected!</h1><p>Connected to <strong>${calendarInfo.summary}</strong> (${userInfo.email})</p><script>if(window.opener){window.opener.postMessage({type:'google-calendar-connected',success:true},'*');setTimeout(()=>window.close(),1000);}else{location.href='/admin';}</script></div>`);
  } catch (err) {
    return htmlResponse(`<h1 style="color:#dc2626;">Error</h1><p>${err instanceof Error ? err.message : "Unknown"}</p>`);
  }
});

app.get("/api/admin/calendar-status", async (c) => {
  const { rows } = await query<{ calendar_id: string; calendar_name: string; user_email: string }>("SELECT * FROM google_oauth_tokens LIMIT 1");
  if (!rows[0]) return c.json({ connected: false });
  return c.json({ connected: true, calendarName: rows[0].calendar_name, userEmail: rows[0].user_email, calendarId: rows[0].calendar_id });
});

app.post("/api/admin/disconnect-calendar", async (c) => {
  await query("DELETE FROM google_oauth_tokens");
  return c.json({ success: true });
});

// ==================== ADMIN DASHBOARD ====================

app.get("/api/admin/dashboard", async (c) => {
  const today = new Date().toISOString().slice(0, 10);
  const upcomingCount = await query<{ n: string }>(
    "SELECT COUNT(*)::int AS n FROM appointments WHERE appointment_date >= $1 AND status <> 'cancelled'", [today]
  );
  const newLeads = await query<{ n: string }>(
    "SELECT COUNT(*)::int AS n FROM intake_leads WHERE created_at >= NOW() - INTERVAL '7 days'"
  );
  const totalAppts = await query<{ n: string }>("SELECT COUNT(*)::int AS n FROM appointments");
  const totalLeads = await query<{ n: string }>("SELECT COUNT(*)::int AS n FROM intake_leads");
  const convertedLeads = await query<{ n: string }>("SELECT COUNT(*)::int AS n FROM intake_leads WHERE status = 'converted'");

  const upcoming = await query(
    "SELECT * FROM appointments WHERE appointment_date >= $1 AND status <> 'cancelled' ORDER BY appointment_date ASC, appointment_time ASC LIMIT 8", [today]
  );

  const tLeads = Number(totalLeads.rows[0].n);
  const conv = Number(convertedLeads.rows[0].n);
  const conversionRate = tLeads > 0 ? Math.round((conv / tLeads) * 1000) / 10 : 0;

  return c.json({
    stats: {
      upcomingAppointments: Number(upcomingCount.rows[0].n),
      newLeads: Number(newLeads.rows[0].n),
      totalAppointments: Number(totalAppts.rows[0].n),
      conversionRate,
    },
    upcoming: upcoming.rows,
  });
});

const PAGE_SIZE = 25;

app.get("/api/admin/appointments", async (c) => {
  const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
  const status = c.req.query("status");
  const from = c.req.query("from");
  const to = c.req.query("to");
  const search = c.req.query("search");

  const where: string[] = [];
  const params: any[] = [];
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  if (from) { params.push(from); where.push(`appointment_date >= $${params.length}`); }
  if (to) { params.push(to); where.push(`appointment_date <= $${params.length}`); }
  if (search) { params.push(`%${search}%`); const i = params.length; where.push(`(first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i})`); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const totalRes = await query<{ n: string }>(`SELECT COUNT(*)::int AS n FROM appointments ${whereSql}`, params);
  const rows = await query(
    `SELECT * FROM appointments ${whereSql} ORDER BY appointment_date DESC, appointment_time DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    params
  );
  return c.json({ rows: rows.rows, total: Number(totalRes.rows[0].n) });
});

app.patch("/api/admin/appointments/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = (await c.req.json()) as { status?: string; notes?: string };
  const sets: string[] = [];
  const params: any[] = [];
  if (body.status !== undefined) { params.push(body.status); sets.push(`status = $${params.length}`); }
  if (body.notes !== undefined) { params.push(body.notes); sets.push(`notes = $${params.length}`); }
  if (sets.length === 0) return c.json({ success: true });
  params.push(id);
  await query(`UPDATE appointments SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${params.length}`, params);
  return c.json({ success: true });
});

function csvEscape(v: any): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: any[], cols: string[]): string {
  const header = cols.join(",");
  const lines = rows.map((r) => cols.map((col) => csvEscape(r[col])).join(","));
  return [header, ...lines].join("\n");
}

app.get("/api/admin/appointments/export", async (c) => {
  const rows = await query("SELECT * FROM appointments ORDER BY created_at DESC");
  const cols = ["id", "first_name", "last_name", "email", "phone", "business_type", "annual_revenue", "primary_goal", "appointment_date", "appointment_time", "status", "notes", "created_at"];
  c.header("Content-Type", "text/csv");
  c.header("Content-Disposition", 'attachment; filename="appointments.csv"');
  return c.body(toCsv(rows.rows, cols));
});

app.get("/api/admin/leads", async (c) => {
  const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
  const status = c.req.query("status");
  const state = c.req.query("state");
  const premium = c.req.query("premium");
  const search = c.req.query("search");

  const where: string[] = [];
  const params: any[] = [];
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  if (state) { params.push(state); where.push(`state = $${params.length}`); }
  if (premium === "true" || premium === "false") { params.push(premium === "true"); where.push(`wants_premium = $${params.length}`); }
  if (search) { params.push(`%${search}%`); const i = params.length; where.push(`(first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i})`); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const totalRes = await query<{ n: string }>(`SELECT COUNT(*)::int AS n FROM intake_leads ${whereSql}`, params);
  const rows = await query(
    `SELECT * FROM intake_leads ${whereSql} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    params
  );
  return c.json({ rows: rows.rows, total: Number(totalRes.rows[0].n) });
});

app.patch("/api/admin/leads/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = (await c.req.json()) as { status?: string; notes?: string };
  const sets: string[] = [];
  const params: any[] = [];
  if (body.status !== undefined) { params.push(body.status); sets.push(`status = $${params.length}`); }
  if (body.notes !== undefined) { params.push(body.notes); sets.push(`notes = $${params.length}`); }
  if (sets.length === 0) return c.json({ success: true });
  params.push(id);
  await query(`UPDATE intake_leads SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${params.length}`, params);
  return c.json({ success: true });
});

app.get("/api/admin/leads/export", async (c) => {
  const rows = await query("SELECT * FROM intake_leads ORDER BY created_at DESC");
  const cols = ["id", "first_name", "last_name", "email", "phone", "filing_status", "state", "income_sources", "complexity_flags", "estimate_min", "estimate_max", "wants_premium", "status", "notes", "created_at"];
  c.header("Content-Type", "text/csv");
  c.header("Content-Disposition", 'attachment; filename="leads.csv"');
  return c.body(toCsv(rows.rows, cols));
});

app.get("/api/admin/settings", async (c) => {
  return c.json(await getSettings());
});

app.put("/api/admin/settings", async (c) => {
  const body = (await c.req.json()) as Partial<BookingSettings>;
  const merged: BookingSettings = { ...DEFAULT_SETTINGS, ...body };
  await saveSettings(merged);
  return c.json(merged);
});

// ==================== CONTENT ====================

interface ServiceTierContent {
  name: string;
  label: string;
  price: string;
  priceNote?: string;
  bestFor: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
}

interface SiteContent {
  tiers: ServiceTierContent[];
}

const DEFAULT_CONTENT: SiteContent = {
  tiers: [
    {
      name: "GOOD",
      label: "Tax Prep Only",
      price: "Starting at $400",
      priceNote: "",
      bestFor: "Stable income, minimal complexity",
      features: ["Federal + state filing", "Basic compliance review", "Standard deduction analysis", "E-file with confirmation"],
      cta: "Book Basic Prep",
      ctaLink: "/book",
      popular: false,
    },
    {
      name: "BETTER",
      label: "Strategy + Filing",
      price: "Starting at $1,900",
      priceNote: "Plan delivered in 7–14 days",
      bestFor: "Business owners & high earners who want legal savings",
      features: ["Annual strategy plan", "Quarterly projections", "Entity structure review", "Tax filing included", "Audit-ready documentation"],
      cta: "Start Your Strategy",
      ctaLink: "/book",
      popular: true,
    },
    {
      name: "BEST",
      label: "Year-Round Advisory",
      price: "Starting at $500",
      priceNote: "per month",
      bestFor: "Growing revenue, complex multi-income streams",
      features: ["Monthly advisory calls", "Quarterly tax management", "Year-end execution oversight", "Proactive planning updates", "Priority support access", "All Strategy + Filing benefits"],
      cta: "Apply for Advisory",
      ctaLink: "/book",
      popular: false,
    },
  ],
};

async function getContent(): Promise<SiteContent> {
  const { rows } = await query<{ value: string }>("SELECT value FROM settings WHERE key = $1", ["site_content"]);
  if (rows.length && rows[0].value) {
    try { return JSON.parse(rows[0].value) as SiteContent; } catch { /* fall through */ }
  }
  return DEFAULT_CONTENT;
}

async function saveContent(content: SiteContent): Promise<void> {
  await query(
    "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    ["site_content", JSON.stringify(content)]
  );
}

app.get("/api/content", async (c) => {
  return c.json(await getContent());
});

app.get("/api/admin/content", async (c) => {
  return c.json(await getContent());
});

app.put("/api/admin/content", async (c) => {
  const body = (await c.req.json()) as SiteContent;
  await saveContent(body);
  return c.json({ success: true });
});

app.get("/api/admin/integrations", (c) => {
  return c.json({
    brevo: brevoConfigured(),
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
});

app.post("/api/admin/test-email", async (c) => {
  const { to } = (await c.req.json()) as { to: string };
  if (!to) return c.json({ success: false, error: "Recipient required" }, 400);
  const result = await sendEmail({
    to,
    subject: "Carolina Tax Strategy — Test Email",
    html: `<div style="font-family:Inter,Arial,sans-serif;padding:24px;"><h2 style="color:#102a43;">Test Email</h2><p>If you are reading this, Brevo email delivery is working.</p></div>`,
  });
  return c.json(result, result.success ? 200 : 500);
});

// ==================== SPA FALLBACK ====================
app.get("*", (c) => {
  const indexPath = join(distDir, "index.html");
  if (existsSync(indexPath)) {
    return c.html(readFileSync(indexPath, "utf-8"));
  }
  return c.text("Frontend not built", 404);
});

// ==================== BOOT ====================
const port = Number(process.env.PORT) || 3000;

initSchema()
  .catch((e) => console.error("Schema init failed:", e))
  .finally(() => {
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(`Server listening on port ${info.port}`);
    });
  });

export default app;
