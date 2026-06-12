import { query } from "./db";

export interface TokenInfo {
  accessToken: string;
  calendarId: string;
}

interface TokenRow {
  id: number;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  calendar_id: string;
}

export async function getValidAccessToken(): Promise<TokenInfo | null> {
  const { rows } = await query<TokenRow>("SELECT * FROM google_oauth_tokens LIMIT 1");
  const tokenRow = rows[0];
  if (!tokenRow) return null;

  const expiresAt = new Date(tokenRow.expires_at);
  const now = new Date();

  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    if (!tokenRow.refresh_token || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return null;
    }
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: tokenRow.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const data = (await response.json()) as { access_token: string; expires_in: number; error?: string };
    if (data.error) {
      console.error("Failed to refresh token:", data.error);
      return null;
    }
    const newExpiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
    await query(
      "UPDATE google_oauth_tokens SET access_token = $1, expires_at = $2, updated_at = NOW() WHERE id = $3",
      [data.access_token, newExpiresAt, tokenRow.id]
    );
    return { accessToken: data.access_token, calendarId: tokenRow.calendar_id };
  }

  return { accessToken: tokenRow.access_token, calendarId: tokenRow.calendar_id };
}

export interface CalendarAppointment {
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

// Convert "4:00 PM" -> "16:00"
export function to24h(time: string): string {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return time;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

export async function createCalendarEventOAuth(
  accessToken: string,
  calendarId: string,
  appointment: CalendarAppointment,
  appointmentLengthMin = 30
): Promise<string | null> {
  const time24 = to24h(appointment.appointmentTime);
  // appointmentDate is YYYY-MM-DD; build a naive local datetime and tag with timezone.
  const startLocal = `${appointment.appointmentDate}T${time24}:00`;
  const start = new Date(`${startLocal}`);
  const end = new Date(start.getTime() + appointmentLengthMin * 60 * 1000);

  const event = {
    summary: `Tax Strategy Call - ${appointment.firstName} ${appointment.lastName}`,
    description: `Client: ${appointment.firstName} ${appointment.lastName}
Email: ${appointment.email}
Phone: ${appointment.phone || "Not provided"}
Business Type: ${appointment.businessType || "Not specified"}
Annual Revenue: ${appointment.annualRevenue || "Not specified"}
Primary Goal: ${appointment.primaryGoal || "Not specified"}`,
    start: { dateTime: start.toISOString(), timeZone: "America/New_York" },
    end: { dateTime: end.toISOString(), timeZone: "America/New_York" },
    attendees: [{ email: appointment.email }],
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }
  );
  if (!response.ok) {
    console.error("Calendar API error:", await response.text());
    return null;
  }
  const result = (await response.json()) as { id: string };
  return result.id;
}

// Free/Busy lookup for a time window. Returns array of {start,end} ISO strings.
export async function getBusyTimes(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<{ start: string; end: string }[]> {
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
  });
  if (!response.ok) {
    console.error("FreeBusy error:", await response.text());
    return [];
  }
  const data = (await response.json()) as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
  return data.calendars?.[calendarId]?.busy || [];
}
