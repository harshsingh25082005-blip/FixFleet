// The only place the frontend talks to the backend.
//
// On start-up, connect() calls GET /health on the C++ REST API. If the server
// answers, every call below goes to the API (live mode). If it doesn't, the same
// calls run against an in-memory copy of demoData.js (demo mode), so the UI stays
// usable before the C++ server exists. Demo changes reset when the page reloads.
import {
  initialBookings,
  initialBusySlots,
  providers as demoProviders,
  services as demoServices,
} from './demoData.js';
import { ACTIVE_STATUSES, slotKey } from './utils.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080/api').replace(/\/$/, '');
const HEALTH_TIMEOUT_MS = 1500;
const REQUEST_TIMEOUT_MS = 8000;

// Error classes mirror the C++ exception hierarchy:
// FixFleetException → ApiError, SlotUnavailableException → SlotUnavailableError.
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class SlotUnavailableError extends ApiError {
  constructor(message = 'That time was just booked by someone else. Pick another slot.') {
    super(message, 409);
    this.name = 'SlotUnavailableError';
  }
}

let mode = 'demo';

async function http(path, { method = 'GET', body, timeout = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(BASE_URL + path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new ApiError(`The server's reply to ${path} isn't JSON.`, res.status);
      }
    }
    if (!res.ok) {
      const message = data?.error || data?.message || `The server answered ${res.status} for ${path}.`;
      throw res.status === 409 ? new SlotUnavailableError(message) : new ApiError(message, res.status);
    }
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.name === 'AbortError' ? 'The FixFleet server took too long to answer.' : 'Could not reach the FixFleet server.',
    );
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Demo mode: an in-memory stand-in for the C++ server, with the same rules.
// ---------------------------------------------------------------------------

const store = {
  bookings: initialBookings(),
  busy: initialBusySlots(),
  nextId: 1004,
};

const pause = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => JSON.parse(JSON.stringify(value));
const findProvider = (id) => demoProviders.find((p) => p.id === Number(id));

function withProviderName(booking) {
  return { ...booking, providerName: findProvider(booking.providerId)?.name ?? `Provider #${booking.providerId}` };
}

function takenFor(providerId) {
  const own = store.busy
    .filter((key) => key.startsWith(`${providerId}|`))
    .map((key) => key.slice(key.indexOf('|') + 1));
  const booked = store.bookings
    .filter((b) => b.providerId === Number(providerId) && ACTIVE_STATUSES.includes(b.status))
    .map((b) => slotKey(b.date, b.time));
  return [...own, ...booked];
}

// Each action maps to a Booking method in the C++ code and is only allowed
// from certain statuses, the same check the server should make.
const TRANSITIONS = {
  accept: { from: ['Pending'], to: 'Confirmed', verb: 'accepted' },
  reject: { from: ['Pending'], to: 'Rejected', verb: 'rejected' },
  cancel: { from: ['Pending', 'Confirmed'], to: 'Cancelled', verb: 'cancelled' },
  complete: { from: ['Confirmed'], to: 'Completed', verb: 'completed' },
};

const demo = {
  async services() {
    await pause();
    return copy(demoServices);
  },

  async providers() {
    await pause();
    return demoProviders.map(({ busy, ...publicFields }) => copy(publicFields));
  },

  async bookings({ customerId, providerId } = {}) {
    await pause();
    return store.bookings
      .filter((b) => (customerId == null || b.customerId === Number(customerId))
        && (providerId == null || b.providerId === Number(providerId)))
      .map(withProviderName);
  },

  async takenSlots(providerId) {
    return takenFor(providerId);
  },

  async create(request) {
    await pause(400);
    const provider = findProvider(request.providerId);
    if (!provider) throw new ApiError('That provider is no longer listed.', 404);
    if (!request.location?.trim()) throw new ApiError('Add the address where the work is needed.', 400);
    if (takenFor(provider.id).includes(slotKey(request.date, request.time))) throw new SlotUnavailableError();

    const booking = {
      id: store.nextId++,
      customerId: Number(request.customerId),
      customerName: request.customerName,
      providerId: provider.id,
      service: provider.service,
      date: request.date,
      time: request.time,
      location: request.location.trim(),
      amount: provider.charge, // the server sets the price; the client's amount is ignored
      status: 'Pending',
      paymentStatus: 'Pending',
    };
    store.bookings.push(booking);
    return withProviderName(booking);
  },

  async transition(id, action) {
    await pause(300);
    const booking = store.bookings.find((b) => b.id === Number(id));
    if (!booking) throw new ApiError(`Booking #${id} doesn't exist.`, 404);
    const rule = TRANSITIONS[action];
    if (!rule.from.includes(booking.status)) {
      throw new ApiError(`Booking #${id} is ${booking.status.toLowerCase()}, so it can't be ${rule.verb}.`, 409);
    }
    booking.status = rule.to;
    if (action === 'complete') booking.paymentStatus = 'Paid';
    if (action === 'reject') booking.paymentStatus = 'Not charged';
    if (action === 'cancel') booking.paymentStatus = booking.paymentStatus === 'Paid' ? 'Refunded' : 'Not charged';
    return withProviderName(booking);
  },
};

// ---------------------------------------------------------------------------
// Public API used by the components.
// ---------------------------------------------------------------------------

const live = () => mode === 'live';
const runAction = (id, action) =>
  live() ? http(`/bookings/${id}/${action}`, { method: 'PUT' }) : demo.transition(id, action);

export const api = {
  baseUrl: BASE_URL,

  async connect() {
    try {
      await http('/health', { timeout: HEALTH_TIMEOUT_MS });
      mode = 'live';
    } catch {
      mode = 'demo';
    }
    return { mode, baseUrl: BASE_URL };
  },

  getServices: () => (live() ? http('/services') : demo.services()),
  getProviders: () => (live() ? http('/providers') : demo.providers()),

  /** Pass { customerId } for the customer dashboard or { providerId } for provider mode. */
  getBookings: (filter) => (live() ? http(`/bookings?${new URLSearchParams(filter)}`) : demo.bookings(filter)),

  /**
   * Slots already taken for a provider, as "YYYY-MM-DD|10:00 AM" strings.
   * The REST contract has no route for this, so live mode returns [] and the
   * server rejects a taken slot with 409 when the booking is created.
   */
  getTakenSlots: (providerId) => (live() ? Promise.resolve([]) : demo.takenSlots(providerId)),

  createBooking: (request) => (live() ? http('/bookings', { method: 'POST', body: request }) : demo.create(request)),
  acceptBooking: (id) => runAction(id, 'accept'),
  rejectBooking: (id) => runAction(id, 'reject'),
  cancelBooking: (id) => runAction(id, 'cancel'),
  completeBooking: (id) => runAction(id, 'complete'),
};
