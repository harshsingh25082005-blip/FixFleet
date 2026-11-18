import { ShieldCheck } from 'lucide-react';
import BookingTicket from './BookingTicket.jsx';
import { ServiceIcon } from './icons.jsx';
import { byWhen, formatHours, initials, plural, rupees } from '../utils.js';

function JobGroup({ id, title, bookings, empty, stampedId, actionsFor }) {
  return (
    <section className="job-group" aria-labelledby={id}>
      <div className="section-head">
        <h2 id={id}>{title}</h2>
        <span className="count">{bookings.length}</span>
      </div>
      {bookings.length === 0 ? (
        <p className="empty">{empty}</p>
      ) : (
        <ol className="tickets">
          {bookings.map((b) => (
            <li key={b.id}>
              <BookingTicket
                booking={b}
                viewpoint="provider"
                stamped={stampedId === b.id}
                actions={actionsFor ? actionsFor(b) : []}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function ProviderDashboard({ provider, bookings, stampedId, onAction }) {
  const requests = bookings.filter((b) => b.status === 'Pending').sort(byWhen);
  const upcoming = bookings.filter((b) => b.status === 'Confirmed').sort(byWhen);
  const past = bookings.filter((b) => !['Pending', 'Confirmed'].includes(b.status)).sort((a, b) => byWhen(b, a));
  const paid = bookings.filter((b) => b.paymentStatus === 'Paid');
  const earned = paid.reduce((sum, b) => sum + b.amount, 0);

  return (
    <main className="layout">
      <section className="primary" aria-label="Jobs">
        <header className="finder">
          <h1>Your jobs</h1>
          <p className="lede">
            {plural(requests.length, 'request')} waiting for your reply, {plural(upcoming.length, 'job')} coming up.
          </p>
        </header>

        <JobGroup
          id="requests-heading"
          title="Requests waiting"
          bookings={requests}
          stampedId={stampedId}
          empty="No new requests. When a customer books you, the request shows up here."
          actionsFor={(b) => [
            { key: 'accept', label: 'Accept job', busyLabel: 'Accepting…', tone: 'primary', onRun: () => onAction('accept', b.id) },
            {
              key: 'reject',
              label: 'Reject',
              busyLabel: 'Rejecting…',
              tone: 'secondary',
              confirm: { question: 'Reject this request?', yes: 'Yes, reject' },
              onRun: () => onAction('reject', b.id),
            },
          ]}
        />
        <JobGroup
          id="upcoming-heading"
          title="Upcoming jobs"
          bookings={upcoming}
          stampedId={stampedId}
          empty="Nothing scheduled. Accepted requests move here."
          actionsFor={(b) => [
            { key: 'complete', label: 'Mark job complete', busyLabel: 'Saving…', tone: 'primary', onRun: () => onAction('complete', b.id) },
          ]}
        />
        <JobGroup
          id="past-heading"
          title="Past jobs"
          bookings={past}
          stampedId={stampedId}
          empty="Completed, rejected and cancelled jobs show up here."
        />
      </section>

      <aside className="secondary" aria-label="Your profile and earnings">
        {provider && (
          <section className="profile-card" aria-labelledby="me-heading">
            <div className="profile-head">
              <span className="avatar avatar-lg" aria-hidden="true">{initials(provider.name)}</span>
              <div>
                <h2 id="me-heading">{provider.name}</h2>
                <p className="profile-sub">
                  <span className="profile-service">
                    <ServiceIcon name={provider.service} size={16} />
                    {provider.service}
                  </span>
                  {provider.verified && (
                    <span className="badge-verified">
                      <ShieldCheck size={16} aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </p>
              </div>
            </div>
            <dl className="facts facts-stacked">
              <div>
                <dt>Working hours</dt>
                <dd>{formatHours(provider.workingHours)}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{provider.experience} years</dd>
              </div>
              <div>
                <dt>Serves</dt>
                <dd>{provider.area}</dd>
              </div>
              <div>
                <dt>Visit charge</dt>
                <dd>{rupees(provider.charge)}</dd>
              </div>
            </dl>
          </section>
        )}

        <section className="receipt" aria-labelledby="earnings-heading">
          <div className="panel-head">
            <h2 id="earnings-heading">Earnings</h2>
          </div>
          <p className="earned">{rupees(earned)}</p>
          <p className="receipt-note">From {plural(paid.length, 'completed job')} paid through FixFleet.</p>
        </section>
      </aside>
    </main>
  );
}
