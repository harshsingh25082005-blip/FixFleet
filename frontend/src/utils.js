// Formatting and scheduling helpers shared by both dashboards.

export const SLOT_TIMES = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:00 PM'];
export const ACTIVE_STATUSES = ['Pending', 'Confirmed'];

const pad = (n, width = 2) => String(n).padStart(width, '0');

/** Local calendar date as YYYY-MM-DD, offset by a number of days from today. */
export function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function upcomingDays(count = 3) {
  return Array.from({ length: count }, (_, i) => isoDate(i));
}

function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function dayLabel(iso) {
  if (iso === isoDate(0)) return 'Today';
  if (iso === isoDate(1)) return 'Tomorrow';
  if (iso === isoDate(-1)) return 'Yesterday';
  return parseIso(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "Tomorrow, 10:00 AM" for labels. */
export const formatSlot = (iso, time) => `${dayLabel(iso)}, ${time}`;

/** "tomorrow at 10:00 AM" for use inside sentences. */
export function whenText(iso, time) {
  const label = dayLabel(iso);
  const relative = ['Today', 'Tomorrow', 'Yesterday'].includes(label);
  return `${relative ? label.toLowerCase() : label} at ${time}`;
}

/** Minutes since midnight for "02:00 PM" or "14:00". */
export function toMinutes(time) {
  const twelve = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (twelve) {
    let hours = Number(twelve[1]) % 12;
    if (twelve[3].toUpperCase() === 'PM') hours += 12;
    return hours * 60 + Number(twelve[2]);
  }
  const plain = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  return plain ? Number(plain[1]) * 60 + Number(plain[2]) : 0;
}

function clock(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return m ? `${h12}:${pad(m)} ${suffix}` : `${h12} ${suffix}`;
}

/** "09:00-18:00" (the C++ ServiceProvider::workingHours format) → "9 AM to 6 PM". */
export function formatHours(range) {
  const [open, close] = range.split('-').map(toMinutes);
  return `${clock(open)} to ${clock(close)}`;
}

/** One-hour visit slots that fit inside a provider's working hours. */
export function slotsFor(provider) {
  const [open, close] = provider.workingHours.split('-').map(toMinutes);
  return SLOT_TIMES.filter((t) => {
    const start = toMinutes(t);
    return start >= open && start + 60 <= close;
  });
}

/** A slot is too late to book if it has passed or starts within 30 minutes. */
export function isPast(iso, time) {
  const today = isoDate(0);
  if (iso < today) return true;
  if (iso > today) return false;
  const now = new Date();
  return toMinutes(time) <= now.getHours() * 60 + now.getMinutes() + 30;
}

export const slotKey = (iso, time) => `${iso}|${time}`;

export function nextFreeSlot(provider, taken = []) {
  const blocked = new Set(taken);
  for (const day of upcomingDays(3)) {
    for (const time of slotsFor(provider)) {
      if (!blocked.has(slotKey(day, time)) && !isPast(day, time)) return { date: day, time };
    }
  }
  return null;
}

const whenKey = (b) => `${b.date} ${pad(toMinutes(b.time), 4)}`;
export const byWhen = (a, b) => whenKey(a).localeCompare(whenKey(b));

/** Active bookings first (soonest first), then finished ones (latest first). */
export function sortBookings(list) {
  const active = list.filter((b) => ACTIVE_STATUSES.includes(b.status)).sort(byWhen);
  const done = list.filter((b) => !ACTIVE_STATUSES.includes(b.status)).sort((a, b) => byWhen(b, a));
  return [...active, ...done];
}

export const rupees = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const firstName = (name = '') => name.split(/\s+/)[0];

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function timeAgo(timestamp) {
  const seconds = (Date.now() - timestamp) / 1000;
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
}
