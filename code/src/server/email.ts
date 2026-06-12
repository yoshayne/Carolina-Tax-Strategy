const BRAND_NAVY = "#102a43";
const BRAND_TEAL = "#2d6a6a";
const BRAND_GOLD = "#c4a35a";
const LOGO = "https://carolinataxstrategy.com/logo.png";
const RESCHEDULE_EMAIL = "info@carolinataxstrategy.com";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export function brevoConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn("BREVO_API_KEY not set; skipping email to", to);
      return { success: false, error: "BREVO_API_KEY not configured" };
    }
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || "info@carolinataxstrategy.com",
          name: process.env.BREVO_SENDER_NAME || "Carolina Tax Strategy",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo email failed:", res.status, body);
      return { success: false, error: `Brevo ${res.status}: ${body}` };
    }
    return { success: true };
  } catch (err) {
    console.error("sendEmail error:", err);
    return { success: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

function layout(inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f0f4f8;font-family:Inter,Arial,sans-serif;color:${BRAND_NAVY};">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="text-align:center;padding:16px 0;">
      <img src="${LOGO}" alt="Carolina Tax Strategy" style="height:48px;" />
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:32px;">
      ${inner}
    </div>
    <p style="text-align:center;color:#627d98;font-size:12px;margin-top:24px;">
      Carolina Tax Strategy, LLC · Charlotte, NC<br/>
      &copy; ${new Date().getFullYear()} Carolina Tax Strategy. All rights reserved.
    </p>
  </div></body></html>`;
}

export interface AppointmentEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  businessType?: string | null;
  annualRevenue?: string | null;
  primaryGoal?: string | null;
  appointmentDate: string;
  appointmentTime: string;
}

function formatEstDate(dateStr: string): string {
  // dateStr is YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}

export async function sendBookingEmails(appt: AppointmentEmailData): Promise<void> {
  try {
    const dateLabel = formatEstDate(appt.appointmentDate);
    const clientHtml = layout(`
      <h1 style="font-family:Georgia,serif;color:${BRAND_NAVY};">You're All Set!</h1>
      <p>Hi ${appt.firstName}, your free tax strategy session is confirmed.</p>
      <div style="background:#f0f4f8;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;font-weight:600;">${dateLabel}</p>
        <p style="margin:4px 0 0;color:${BRAND_TEAL};">${appt.appointmentTime} EST · 30 minutes · Video call (Zoom)</p>
      </div>
      <h3 style="color:${BRAND_NAVY};">What to Expect</h3>
      <ul style="color:#334e68;">
        <li>A Zoom link and calendar invite will be sent to your email.</li>
        <li>You'll receive a reminder 24 hours before your session.</li>
        <li>Have your most recent tax return handy (optional but helpful).</li>
      </ul>
      <p style="color:#627d98;font-size:14px;">Need to reschedule? Email us at
        <a href="mailto:${RESCHEDULE_EMAIL}" style="color:${BRAND_TEAL};">${RESCHEDULE_EMAIL}</a>.</p>
    `);
    await sendEmail({ to: appt.email, subject: "Your Tax Strategy Session is Confirmed", html: clientHtml });

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      const adminHtml = layout(`
        <h1 style="font-family:Georgia,serif;color:${BRAND_NAVY};">New Strategy Session Booked</h1>
        <table style="width:100%;border-collapse:collapse;color:#334e68;">
          <tr><td style="padding:6px 0;"><strong>Name</strong></td><td>${appt.firstName} ${appt.lastName}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Email</strong></td><td>${appt.email}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone</strong></td><td>${appt.phone || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Business Type</strong></td><td>${appt.businessType || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Annual Revenue</strong></td><td>${appt.annualRevenue || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Primary Goal</strong></td><td>${appt.primaryGoal || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Date</strong></td><td>${dateLabel}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Time</strong></td><td>${appt.appointmentTime} EST</td></tr>
        </table>
      `);
      await sendEmail({ to: adminEmail, subject: `New Booking: ${appt.firstName} ${appt.lastName}`, html: adminHtml });
    }
  } catch (err) {
    console.error("sendBookingEmails error:", err);
  }
}

export interface IntakeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  filingStatus?: string;
  state?: string;
  incomeSources: string[];
  complexityFlags: string[];
  estimateMin: number;
  estimateMax: number;
  wantsPremium: boolean;
}

export async function sendIntakeEmails(lead: IntakeEmailData): Promise<void> {
  try {
    const range = `$${lead.estimateMin.toLocaleString()} – $${lead.estimateMax.toLocaleString()}${lead.estimateMax >= 1200 ? "+" : ""}`;
    const clientHtml = layout(`
      <h1 style="font-family:Georgia,serif;color:${BRAND_NAVY};">We Received Your Request</h1>
      <p>Hi ${lead.firstName}, thanks for choosing Carolina Tax Strategy. Based on what you shared, your estimated fee is:</p>
      <div style="background:linear-gradient(135deg,${BRAND_NAVY},#243b53);border-radius:8px;padding:24px;text-align:center;margin:16px 0;">
        <p style="color:#ffffff99;margin:0;font-size:13px;">Estimated Fee</p>
        <p style="color:${BRAND_GOLD};font-size:28px;font-weight:700;margin:8px 0 0;">${range}</p>
      </div>
      <p style="color:#627d98;font-size:14px;">This is an estimate; your final quote is confirmed during your consultation.</p>
      <h3 style="color:${BRAND_NAVY};">What Happens Next</h3>
      <ol style="color:#334e68;">
        <li><strong>Schedule Call</strong> — Book a convenient time (Day 1).</li>
        <li><strong>Consultation</strong> — We review your situation (Day 1–2).</li>
        <li><strong>Preparation</strong> — Your return is prepared by a licensed pro (2–4 days).</li>
        <li><strong>Review &amp; E-File</strong> — You approve, we file electronically (1–2 days).</li>
      </ol>
      <p style="text-align:center;margin-top:24px;">
        <a href="https://carolinataxstrategy.com/book" style="background:${BRAND_GOLD};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">Schedule Your Consultation</a>
      </p>
    `);
    await sendEmail({ to: lead.email, subject: "Your Tax Prep Estimate from Carolina Tax Strategy", html: clientHtml });

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminEmail) {
      const adminHtml = layout(`
        <h1 style="font-family:Georgia,serif;color:${BRAND_NAVY};">New Tax-Prep Lead</h1>
        <table style="width:100%;border-collapse:collapse;color:#334e68;">
          <tr><td style="padding:6px 0;"><strong>Name</strong></td><td>${lead.firstName} ${lead.lastName}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Email</strong></td><td>${lead.email}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone</strong></td><td>${lead.phone || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Filing Status</strong></td><td>${lead.filingStatus || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>State</strong></td><td>${lead.state || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Income Sources</strong></td><td>${lead.incomeSources.join(", ") || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Complexity</strong></td><td>${lead.complexityFlags.join(", ") || "—"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Estimate</strong></td><td>${range}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Wants Premium</strong></td><td>${lead.wantsPremium ? "Yes" : "No"}</td></tr>
        </table>
      `);
      await sendEmail({ to: adminEmail, subject: `New Lead: ${lead.firstName} ${lead.lastName}`, html: adminHtml });
    }
  } catch (err) {
    console.error("sendIntakeEmails error:", err);
  }
}
