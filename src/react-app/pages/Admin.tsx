import { useEffect, useState, useCallback } from "react";

interface CalendarStatus {
  connected: boolean;
  calendarName?: string;
  userEmail?: string;
  calendarId?: string;
}

interface DashboardStats {
  upcomingAppointments: number;
  newLeads: number;
  totalAppointments: number;
  conversionRate: number;
}

interface Appointment {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  annual_revenue: string | null;
  primary_goal: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  filing_status: string | null;
  state: string | null;
  income_sources: string | null;
  complexity_flags: string | null;
  estimate_min: number | null;
  estimate_max: number | null;
  wants_premium: boolean;
  status: string;
  notes: string | null;
  created_at: string;
}

type Tab = "dashboard" | "appointments" | "leads" | "settings" | "integrations";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "appointments", label: "Appointments" },
  { id: "leads", label: "Tax-Prep Leads" },
  { id: "settings", label: "Availability" },
  { id: "integrations", label: "Integrations" },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-navy-900 text-white flex flex-col py-6 px-4 min-h-screen">
        <div className="px-2 mb-8">
          <h1 className="text-xl font-serif">Carolina Tax</h1>
          <p className="text-xs text-white/60">Admin Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? "bg-teal text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-2 pt-6">
          <a href="/" className="text-sm text-white/50 hover:text-white">← Back to website</a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {tab === "dashboard" && <DashboardTab onNavigate={setTab} />}
        {tab === "appointments" && <AppointmentsTab />}
        {tab === "leads" && <LeadsTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "integrations" && <IntegrationsTab />}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-navy-900 mt-2">{value}</p>
    </div>
  );
}

function DashboardTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [calStatus, setCalStatus] = useState<CalendarStatus | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard").then((r) => r.json()).then((d) => {
      setStats(d.stats);
      setUpcoming(d.upcoming || []);
    }).catch(() => {});
    fetch("/api/admin/calendar-status").then((r) => r.json()).then(setCalStatus).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Upcoming Appointments" value={stats?.upcomingAppointments ?? "—"} />
        <StatCard label="New Leads (7 days)" value={stats?.newLeads ?? "—"} />
        <StatCard label="Total Appointments" value={stats?.totalAppointments ?? "—"} />
        <StatCard label="Conversion Rate" value={stats ? `${stats.conversionRate}%` : "—"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Upcoming Appointments</h3>
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcoming.map((a) => (
                <li key={a.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium text-navy-900">{a.first_name} {a.last_name}</p>
                    <p className="text-sm text-gray-500">{a.email}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-navy-900">{a.appointment_date}</p>
                    <p className="text-gray-500">{a.appointment_time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Google Calendar</h3>
          {calStatus?.connected ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
              <p className="font-medium text-emerald-800 mb-1">Connected</p>
              <p>{calStatus.calendarName}</p>
              <p>{calStatus.userEmail}</p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p className="mb-3">Calendar not connected.</p>
              <button onClick={() => onNavigate("integrations")} className="text-teal font-medium hover:underline">
                Connect in Integrations →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const r = await fetch(`/api/admin/appointments?${params}`);
    const d = await r.json();
    setRows(d.rows || []);
    setTotal(d.total || 0);
  }, [page, status, search, from, to]);

  useEffect(() => { load(); }, [load]);

  async function updateRow(id: number, patch: Partial<Appointment>) {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Appointments</h2>
        <a href="/api/admin/appointments/export" className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-dark">
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input placeholder="Search name/email" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
        <input type="date" value={from} onChange={(e) => { setPage(1); setFrom(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input type="date" value={to} onChange={(e) => { setPage(1); setTo(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Date / Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 text-navy-900 font-medium">{a.first_name} {a.last_name}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}<br />{a.phone}</td>
                <td className="px-4 py-3 text-gray-600">{a.appointment_date}<br />{a.appointment_time}</td>
                <td className="px-4 py-3">
                  <select value={a.status} onChange={(e) => updateRow(a.id, { status: e.target.value })} className="border border-gray-300 rounded px-2 py-1 text-xs">
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No-show</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input defaultValue={a.notes || ""} onBlur={(e) => updateRow(a.id, { notes: e.target.value })} placeholder="Add note…" className="border border-gray-200 rounded px-2 py-1 text-xs w-40" />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} onChange={setPage} />
    </div>
  );
}

function LeadsTab() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [state, setState] = useState("");
  const [premium, setPremium] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    if (state) params.set("state", state);
    if (premium) params.set("premium", premium);
    if (search) params.set("search", search);
    const r = await fetch(`/api/admin/leads?${params}`);
    const d = await r.json();
    setRows(d.rows || []);
    setTotal(d.total || 0);
  }, [page, status, state, premium, search]);

  useEffect(() => { load(); }, [load]);

  async function updateRow(id: number, patch: Partial<Lead>) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Tax-Prep Leads</h2>
        <a href="/api/admin/leads/export" className="bg-teal text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-dark">
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input placeholder="Search name/email" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
        <input placeholder="State" value={state} onChange={(e) => { setPage(1); setState(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28" />
        <select value={premium} onChange={(e) => { setPage(1); setPremium(e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Premium: any</option>
          <option value="true">Wants premium</option>
          <option value="false">No premium</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Estimate</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 text-navy-900 font-medium">{l.first_name} {l.last_name}</td>
                <td className="px-4 py-3 text-gray-600">{l.email}<br />{l.phone}</td>
                <td className="px-4 py-3 text-gray-600">{l.state}</td>
                <td className="px-4 py-3 text-gray-600">{l.estimate_min != null ? `$${l.estimate_min}–$${l.estimate_max}` : "—"}</td>
                <td className="px-4 py-3">{l.wants_premium ? <span className="text-gold-dark font-medium">Yes</span> : "—"}</td>
                <td className="px-4 py-3">
                  <select value={l.status} onChange={(e) => updateRow(l.id, { status: e.target.value })} className="border border-gray-300 rounded px-2 py-1 text-xs">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input defaultValue={l.notes || ""} onBlur={(e) => updateRow(l.id, { notes: e.target.value })} placeholder="Add note…" className="border border-gray-200 rounded px-2 py-1 text-xs w-40" />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} onChange={setPage} />
    </div>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / 25));
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>{total} total · page {page} of {pages}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40">Prev</button>
        <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

interface Settings {
  businessDays: number[];
  startTime: string;
  endTime: string;
  appointmentLength: number;
  buffer: number;
  blockGoogleBusy: boolean;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  async function save() {
    if (!settings) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <p className="text-gray-500">Loading…</p>;

  function toggleDay(d: number) {
    setSettings((s) => s ? { ...s, businessDays: s.businessDays.includes(d) ? s.businessDays.filter((x) => x !== d) : [...s.businessDays, d].sort() } : s);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Availability & Booking</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">Business Days</label>
          <div className="flex gap-2">
            {DAY_NAMES.map((name, i) => (
              <button key={i} onClick={() => toggleDay(i)} className={`px-3 py-2 rounded-lg text-sm ${settings.businessDays.includes(i) ? "bg-teal text-white" : "bg-gray-100 text-gray-600"}`}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">Start Time (24h, EST)</label>
            <input type="time" value={settings.startTime} onChange={(e) => setSettings({ ...settings, startTime: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">End Time (24h, EST)</label>
            <input type="time" value={settings.endTime} onChange={(e) => setSettings({ ...settings, endTime: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">Appointment Length (min)</label>
            <input type="number" value={settings.appointmentLength} onChange={(e) => setSettings({ ...settings, appointmentLength: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">Buffer Between (min)</label>
            <input type="number" value={settings.buffer} onChange={(e) => setSettings({ ...settings, buffer: Number(e.target.value) })} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm text-navy-700">
          <input type="checkbox" checked={settings.blockGoogleBusy} onChange={(e) => setSettings({ ...settings, blockGoogleBusy: e.target.checked })} />
          Block Google Calendar busy times
        </label>
        <div className="flex items-center gap-3">
          <button onClick={save} className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-2.5 rounded-lg">Save Settings</button>
          {saved && <span className="text-emerald-600 text-sm">Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [integrations, setIntegrations] = useState<{ brevo: boolean; google: boolean } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/calendar-status");
      setStatus(await res.json());
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetch("/api/admin/integrations").then((r) => r.json()).then(setIntegrations).catch(() => {});
  }, [fetchStatus]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "google-calendar-connected" && event.data?.success) {
        setConnecting(false);
        fetchStatus();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchStatus]);

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await fetch("/api/admin/auth/google/url");
      const data = await res.json();
      if (data.error) { console.error(data.error); setConnecting(false); return; }
      const width = 500, height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(data.url, "google-calendar-auth", `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
      const checkClosed = setInterval(() => {
        if (!popup || popup.closed) { clearInterval(checkClosed); setConnecting(false); }
      }, 500);
    } catch (err) {
      console.error(err);
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await fetch("/api/admin/disconnect-calendar", { method: "POST" });
      setStatus({ connected: false });
    } finally {
      setDisconnecting(false);
    }
  }

  async function sendTestEmail() {
    setTestResult("");
    try {
      const r = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail }),
      });
      const d = await r.json();
      setTestResult(d.success ? "Test email sent!" : `Failed: ${d.error || "unknown error"}`);
    } catch (err) {
      setTestResult(`Failed: ${err instanceof Error ? err.message : "error"}`);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Integrations</h2>

      {/* Google Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-navy-900">Google Calendar</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : status?.connected ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
              <p className="font-medium text-emerald-800 mb-1">Calendar Connected</p>
              <p><strong>Calendar:</strong> {status.calendarName}</p>
              <p><strong>Account:</strong> {status.userEmail}</p>
            </div>
            <button onClick={handleDisconnect} disabled={disconnecting} className="w-full py-2.5 px-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">
              {disconnecting ? "Disconnecting…" : "Disconnect Calendar"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Connect your Google Calendar to automatically create events when clients book.</p>
            <button onClick={handleConnect} disabled={connecting} className="w-full py-3 px-4 bg-teal text-white rounded-lg hover:bg-teal-dark font-medium disabled:opacity-50">
              {connecting ? "Connecting…" : "Connect Google Calendar"}
            </button>
          </div>
        )}
      </div>

      {/* Brevo Email */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Brevo Email</h3>
        <div className={`rounded-lg p-4 text-sm mb-4 ${integrations?.brevo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>
          {integrations?.brevo ? "Brevo API key configured." : "Brevo API key not configured (set BREVO_API_KEY)."}
        </div>
        <div className="flex gap-2">
          <input type="email" placeholder="you@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <button onClick={sendTestEmail} disabled={!testEmail} className="bg-gold hover:bg-gold-dark text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">Send Test</button>
        </div>
        {testResult && <p className="text-sm mt-3 text-navy-700">{testResult}</p>}
      </div>
    </div>
  );
}
