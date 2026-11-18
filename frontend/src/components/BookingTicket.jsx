import { useState } from 'react';
import { ServiceIcon } from './icons.jsx';
import { formatSlot, rupees } from '../utils.js';

/**
 * A booking shown as a job ticket. The status stamp matches Booking::status in
 * the C++ code: Pending, Confirmed, Rejected, Cancelled or Completed.
 * `actions` is a list of { key, label, busyLabel, tone, confirm?, onRun }.
 */
export default function BookingTicket({ booking, viewpoint, selected = false, onSelect, stamped = false, actions = [] }) {
  const [confirming, setConfirming] = useState(null);
  const [busyKey, setBusyKey] = useState(null);
  const b = booking;

  async function execute(action) {
    setConfirming(null);
    setBusyKey(action.key);
    try {
      await action.onRun();
    } finally {
      setBusyKey(null);
    }
  }

  const pending = actions.find((a) => a.key === confirming);
  const titleId = `ticket-${b.id}-title`;

  return (
    <article
      className={`ticket${selected ? ' is-selected' : ''}${onSelect ? ' is-selectable' : ''}`}
      aria-labelledby={titleId}
      onClick={onSelect ? (e) => !e.target.closest('button') && onSelect() : undefined}
    >
      <div className="ticket-stub">
        {onSelect ? (
          <button
            type="button"
            className="ticket-no"
            aria-pressed={selected}
            aria-label={`Booking ${b.id}: show payment`}
            onClick={onSelect}
          >
            #{b.id}
          </button>
        ) : (
          <span className="ticket-no">#{b.id}</span>
        )}
        <ServiceIcon name={b.service} size={22} />
      </div>

      <div className="ticket-body">
        <div className="ticket-head">
          <h3 id={titleId}>{b.service}</h3>
          <p className="ticket-who">{viewpoint === 'customer' ? `with ${b.providerName}` : `for ${b.customerName}`}</p>
        </div>

        <dl className="ticket-meta">
          <div>
            <dt>When</dt>
            <dd>{formatSlot(b.date, b.time)}</dd>
          </div>
          <div>
            <dt>Charge</dt>
            <dd>{rupees(b.amount)}</dd>
          </div>
          <div className="wide">
            <dt>Where</dt>
            <dd>{b.location}</dd>
          </div>
        </dl>

        {actions.length > 0 && (
          <div className="ticket-actions">
            {pending ? (
              <>
                <span className="confirm-q">{pending.confirm.question}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => execute(pending)}>
                  {pending.confirm.yes}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(null)}>
                  Keep it
                </button>
              </>
            ) : (
              actions.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  className={`btn btn-${a.tone} btn-sm`}
                  disabled={busyKey !== null}
                  onClick={() => (a.confirm ? setConfirming(a.key) : execute(a))}
                >
                  {busyKey === a.key ? a.busyLabel : a.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <span key={b.status} className={`stamp stamp-${b.status.toLowerCase()}${stamped ? ' stamp-in' : ''}`}>
        {b.status}
      </span>
    </article>
  );
}
