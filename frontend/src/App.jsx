import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from './api.js';
import { CURRENT_CUSTOMER, CURRENT_PROVIDER_ID, initialNotifications } from './demoData.js';
import { firstName, rupees, whenText } from './utils.js';
import TopBar from './components/TopBar.jsx';
import CustomerDashboard from './components/CustomerDashboard.jsx';
import ProviderDashboard from './components/ProviderDashboard.jsx';
import Toast from './components/Toast.jsx';

let nextNoteId = 1;
let nextToastId = 1;

/** Fill in fields a live C++ response might leave out. */
function normalizeBooking(booking, providers) {
  const providerId = Number(booking.providerId);
  return {
    paymentStatus: 'Pending',
    ...booking,
    id: Number(booking.id),
    providerId,
    amount: Number(booking.amount),
    providerName: booking.providerName ?? providers.find((p) => p.id === providerId)?.name ?? `Provider #${providerId}`,
  };
}

// What each booking action says, to whom. Mirrors the C++ calls:
// accept → ServiceProvider::acceptRequest + Booking::confirmBooking, and so on.
const ACTIONS = {
  accept: {
    run: api.acceptBooking,
    toast: (b) => `Job #${b.id} accepted.`,
    customer: (b) => `${b.providerName} accepted your ${b.service} visit for ${whenText(b.date, b.time)}.`,
  },
  reject: {
    run: api.rejectBooking,
    toast: (b) => `Request #${b.id} rejected. The slot is free again.`,
    customer: (b) =>
      `${b.providerName} can't take your ${b.service} visit for ${whenText(b.date, b.time)}. Pick another time or provider.`,
  },
  complete: {
    run: api.completeBooking,
    toast: (b) => `Job #${b.id} marked complete.`,
    customer: (b) => `Job #${b.id} is complete. ${rupees(b.amount)} paid to ${b.providerName}.`,
  },
  cancel: {
    run: api.cancelBooking,
    toast: (b) => `Booking #${b.id} cancelled.`,
    customer: (b) =>
      b.paymentStatus === 'Refunded'
        ? `Booking #${b.id} cancelled. ${rupees(b.amount)} refund initiated.`
        : `Booking #${b.id} cancelled. Nothing was charged.`,
    provider: (b) => `${b.customerName} cancelled booking #${b.id} for ${whenText(b.date, b.time)}.`,
  },
};

export default function App() {
  const [connection, setConnection] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState('customer');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [takenSlots, setTakenSlots] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [stampedId, setStampedId] = useState(null);
  const providersRef = useRef([]);

  const refreshBookings = useCallback(async () => {
    const list = providersRef.current;
    const [mine, jobs] = await Promise.all([
      api.getBookings({ customerId: CURRENT_CUSTOMER.id }),
      api.getBookings({ providerId: CURRENT_PROVIDER_ID }),
    ]);
    setCustomerBookings(mine.map((b) => normalizeBooking(b, list)));
    setProviderBookings(jobs.map((b) => normalizeBooking(b, list)));

    const entries = await Promise.all(list.map(async (p) => [p.id, await api.getTakenSlots(p.id)]));
    setTakenSlots(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const conn = await api.connect();
        const [serviceList, providerList] = await Promise.all([api.getServices(), api.getProviders()]);
        if (cancelled) return;
        providersRef.current = providerList;
        setServices(serviceList);
        setProviders(providerList);
        if (conn.mode === 'demo') setNotifications(initialNotifications());
        await refreshBookings();
        if (!cancelled) setConnection(conn);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'FixFleet could not load.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshBookings]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (text, tone = 'info') => setToast({ id: nextToastId++, text, tone });

  const notify = (audience, text) =>
    setNotifications((list) => [{ id: nextNoteId++, audience, text, at: Date.now(), read: false }, ...list]);

  const markRead = (audience) =>
    setNotifications((list) => list.map((n) => (n.audience === audience ? { ...n, read: true } : n)));

  /** Called by the booking form. Errors are re-thrown so the form can show them inline. */
  async function bookVisit(request) {
    const created = normalizeBooking(await api.createBooking(request), providersRef.current);
    await refreshBookings();
    const when = whenText(created.date, created.time);
    notify('customer', `Visit requested with ${created.providerName} for ${when}. You'll get an update when they reply.`);
    if (created.providerId === CURRENT_PROVIDER_ID) {
      notify('provider', `New request from ${created.customerName}: ${created.service} ${when}.`);
    }
    setStampedId(created.id);
    showToast(`Visit requested. Booking #${created.id} is waiting for ${firstName(created.providerName)}.`);
    return created;
  }

  async function runAction(action, id) {
    const copy = ACTIONS[action];
    try {
      const updated = normalizeBooking(await copy.run(id), providersRef.current);
      await refreshBookings();
      if (updated.customerId === CURRENT_CUSTOMER.id && copy.customer) notify('customer', copy.customer(updated));
      if (updated.providerId === CURRENT_PROVIDER_ID && copy.provider) notify('provider', copy.provider(updated));
      setStampedId(updated.id);
      showToast(copy.toast(updated));
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Something went wrong. Try again.', 'error');
    }
  }

  const me = providers.find((p) => p.id === CURRENT_PROVIDER_ID);

  let content;
  if (loadError) {
    content = <p className="status-message">FixFleet couldn't load: {loadError} Reload the page to try again.</p>;
  } else if (!connection) {
    content = <p className="status-message">Loading services and bookings…</p>;
  } else if (view === 'customer') {
    content = (
      <CustomerDashboard
        services={services}
        providers={providers}
        bookings={customerBookings}
        takenSlots={takenSlots}
        stampedId={stampedId}
        onBook={bookVisit}
        onCancel={(id) => runAction('cancel', id)}
      />
    );
  } else {
    content = (
      <ProviderDashboard
        provider={me}
        bookings={providerBookings}
        stampedId={stampedId}
        onAction={runAction}
      />
    );
  }

  return (
    <div className="app">
      <TopBar
        view={view}
        onViewChange={setView}
        connection={connection}
        userName={view === 'customer' ? CURRENT_CUSTOMER.name : me?.name ?? 'Provider'}
        notifications={notifications.filter((n) => n.audience === view)}
        onMarkRead={() => markRead(view)}
      />
      {content}
      <Toast toast={toast} />
    </div>
  );
}
