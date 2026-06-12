import { query } from "./db";

export interface BookingSettings {
  businessDays: number[]; // 0=Sun .. 6=Sat
  startTime: string; // "16:00"
  endTime: string; // "19:30"
  appointmentLength: number; // minutes
  buffer: number; // minutes
  blockGoogleBusy: boolean;
}

export const DEFAULT_SETTINGS: BookingSettings = {
  businessDays: [1, 2, 3, 4, 5],
  startTime: "16:00",
  endTime: "19:30",
  appointmentLength: 30,
  buffer: 0,
  blockGoogleBusy: true,
};

const SETTINGS_KEY = "booking";

export async function getSettings(): Promise<BookingSettings> {
  const { rows } = await query<{ value: string }>("SELECT value FROM settings WHERE key = $1", [SETTINGS_KEY]);
  if (!rows[0]) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(rows[0].value) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(s: BookingSettings): Promise<void> {
  await query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [SETTINGS_KEY, JSON.stringify(s)]
  );
}
