CREATE TABLE IF NOT EXISTS appointments (
  id                       SERIAL PRIMARY KEY,
  first_name               TEXT,
  last_name                TEXT,
  email                    TEXT,
  phone                    TEXT,
  business_type            TEXT,
  annual_revenue           TEXT,
  primary_goal             TEXT,
  appointment_date         TEXT,
  appointment_time         TEXT,
  google_calendar_event_id TEXT,
  status                   TEXT DEFAULT 'confirmed',
  notes                    TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS google_oauth_tokens (
  id            SERIAL PRIMARY KEY,
  access_token  TEXT,
  refresh_token TEXT,
  expires_at    TIMESTAMPTZ,
  calendar_id   TEXT,
  calendar_name TEXT,
  user_email    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS intake_leads (
  id               SERIAL PRIMARY KEY,
  first_name       TEXT,
  last_name        TEXT,
  email            TEXT,
  phone            TEXT,
  filing_status    TEXT,
  state            TEXT,
  income_sources   TEXT,
  complexity_flags TEXT,
  estimate_min     INTEGER,
  estimate_max     INTEGER,
  wants_premium    BOOLEAN DEFAULT FALSE,
  status           TEXT DEFAULT 'new',
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
