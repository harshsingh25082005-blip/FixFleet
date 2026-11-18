import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ServicePicker from './ServicePicker.jsx';
import ProviderList from './ProviderList.jsx';
import ProviderProfile from './ProviderProfile.jsx';
import BookingTicket from './BookingTicket.jsx';
import PaymentSummary from './PaymentSummary.jsx';
import { ACTIVE_STATUSES, sortBookings } from '../utils.js';

export default function CustomerDashboard({ services, providers, bookings, takenSlots, stampedId, onBook, onCancel }) {
  const [serviceName, setServiceName] = useState(services[0]?.name ?? '');
  const [query, setQuery] = useState('');
  const [openProviderId, setOpenProviderId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const q = query.trim().toLowerCase();
  const shownProviders = useMemo(
    () =>
      providers.filter((p) =>
        q
          ? [p.name, p.service, p.area, ...(p.skills ?? [])].join(' ').toLowerCase().includes(q)
          : p.service === serviceName,
      ),
    [providers, q, serviceName],
  );

  const sorted = sortBookings(bookings);
  const selected = bookings.find((b) => b.id === selectedId) ?? sorted[0];
  const openProvider = providers.find((p) => p.id === openProviderId);
  const service = services.find((s) => s.name === serviceName);
  const heading = q ? `Results for “${query.trim()}”` : `${service?.pros ?? serviceName} near you`;

  async function handleBook(request) {
    const created = await onBook(request);
    setSelectedId(created.id);
    return created;
  }

  return (
    <main className="layout">
      <section className="primary" aria-label="Find a service">
        {openProvider ? (
          <ProviderProfile
            key={openProvider.id}
            provider={openProvider}
            taken={takenSlots[openProvider.id] ?? []}
            onBack={() => setOpenProviderId(null)}
            onBook={handleBook}
          />
        ) : (
          <>
            <header className="finder">
              <h1>What needs fixing?</h1>
              <p className="lede">
                Book a verified electrician, plumber or technician near you in Gandhinagar. You see the visit
                charge before you book and pay after the job is done.
              </p>
              <label className="search" htmlFor="search">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Search providers</span>
                <input
                  id="search"
                  type="search"
                  placeholder="Search by name, skill or area, like “fan” or “Kudasan”"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </header>
            {!q && (
              <ServicePicker
                services={services}
                providers={providers}
                selected={serviceName}
                onSelect={setServiceName}
              />
            )}
            <ProviderList
              heading={heading}
              providers={shownProviders}
              takenSlots={takenSlots}
              onOpen={setOpenProviderId}
            />
          </>
        )}
      </section>

      <aside className="secondary" aria-label="Your bookings and payment">
        <section className="panel" aria-labelledby="bookings-heading">
          <div className="panel-head">
            <h2 id="bookings-heading">Your bookings</h2>
            <span className="count">{bookings.length} total</span>
          </div>
          {sorted.length === 0 ? (
            <p className="empty">No bookings yet. Pick a service and book your first visit.</p>
          ) : (
            <ol className="tickets">
              {sorted.map((b) => (
                <li key={b.id}>
                  <BookingTicket
                    booking={b}
                    viewpoint="customer"
                    selected={selected?.id === b.id}
                    onSelect={() => setSelectedId(b.id)}
                    stamped={stampedId === b.id}
                    actions={
                      ACTIVE_STATUSES.includes(b.status)
                        ? [
                            {
                              key: 'cancel',
                              label: 'Cancel booking',
                              busyLabel: 'Cancelling…',
                              tone: 'secondary',
                              confirm: { question: 'Cancel this visit?', yes: 'Yes, cancel' },
                              onRun: () => onCancel(b.id),
                            },
                          ]
                        : []
                    }
                  />
                </li>
              ))}
            </ol>
          )}
        </section>
        <PaymentSummary booking={selected} />
      </aside>
    </main>
  );
}
