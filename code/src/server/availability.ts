import { query } from "./db";
import { getSettings } from "./settings";
import { getValidAccessToken, getBusyTimes } from "./google";
import type Redis from "ioredis";

interface Slot {
  time: string; // "4:00 PM"
  available: boolean;
}
interface DaySlots {
  date: string; // YYYY-MM-DD
  slots: Slot[];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "16:00" -> minutes since midnight
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// minutes -> "4:00 PM"
function toLabel(mins: number): string {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${pad(m)} ${ampm}`;
}

// Build a Date representing an EST wall-clock moment, returned as a UTC Date.
// EST is UTC-5, EDT is UTC-4. We approximate using America/New_York offset for that date.
function estWallClockToUtc(dateStr: string, minutes: number): Date {
  // Determine offset for the date using Intl.
  const [y, mo, d] = dateStr.split("-").map(Number);
  const probe = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  const tzName = probe.toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" });
  const isDST = tzName.includes("EDT");
  const offsetHours = isDST ? 4 : 5;
  return new Date(Date.UTC(y, mo - 1, d, Math.floor(minutes / 60) + offsetHours, minutes % 60, 0));
}

export async function getWeekAvailability(weekStart: string, redis: Redis | null): Promise<{ days: DaySlots[] }> {
  const settings = await getSettings();
  const startMin = toMinutes(settings.startTime);
  const endMin = toMinutes(settings.endTime);
  const step = settings.appointmentLength + settings.buffer;

  // Parse weekStart (YYYY-MM-DD) as a local date
  const [y, mo, d] = weekStart.split("-").map(Number);
  const start = new Date(y, mo - 1, d);

  const days: DaySlots[] = [];
  const dayDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(start);
    cur.setDate(cur.getDate() + i);
    if (settings.businessDays.includes(cur.getDay())) {
      dayDates.push(dateKey(cur));
    }
  }
  if (dayDates.length === 0) return { days: [] };

  // Booked appointments for these dates
  const { rows: booked } = await query<{ appointment_date: string; appointment_time: string }>(
    `SELECT appointment_date, appointment_time FROM appointments
     WHERE appointment_date = ANY($1) AND status <> 'cancelled'`,
    [dayDates]
  );
  const bookedSet = new Set(booked.map((b) => `${b.appointment_date}|${b.appointment_time}`));

  // Google busy times (cached 60s in Redis)
  let busy: { start: string; end: string }[] = [];
  if (settings.blockGoogleBusy) {
    const cacheKey = `freebusy:${dayDates[0]}:${dayDates[dayDates.length - 1]}`;
    let cached: string | null = null;
    if (redis) {
      try { cached = await redis.get(cacheKey); } catch { /* ignore */ }
    }
    if (cached) {
      busy = JSON.parse(cached);
    } else {
      const token = await getValidAccessToken();
      if (token) {
        const timeMin = estWallClockToUtc(dayDates[0], startMin).toISOString();
        const timeMax = estWallClockToUtc(dayDates[dayDates.length - 1], endMin).toISOString();
        busy = await getBusyTimes(token.accessToken, token.calendarId, timeMin, timeMax);
        if (redis) {
          try { await redis.set(cacheKey, JSON.stringify(busy), "EX", 60); } catch { /* ignore */ }
        }
      }
    }
  }

  const now = Date.now();

  for (const ds of dayDates) {
    const slots: Slot[] = [];
    for (let m = startMin; m + settings.appointmentLength <= endMin; m += step) {
      const label = toLabel(m);
      const slotStart = estWallClockToUtc(ds, m);
      const slotEnd = new Date(slotStart.getTime() + settings.appointmentLength * 60 * 1000);

      let available = true;
      if (slotStart.getTime() <= now) available = false;
      if (bookedSet.has(`${ds}|${label}`)) available = false;
      for (const b of busy) {
        const bs = new Date(b.start).getTime();
        const be = new Date(b.end).getTime();
        if (slotStart.getTime() < be && slotEnd.getTime() > bs) {
          available = false;
          break;
        }
      }
      slots.push({ time: label, available });
    }
    days.push({ date: ds, slots });
  }

  return { days };
}
