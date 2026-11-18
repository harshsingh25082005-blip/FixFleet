import { Receipt } from 'lucide-react';
import { firstName, rupees } from '../utils.js';

// Payment states follow the C++ Payment and Refund classes:
// Pending until the job is done, Paid after Payment::processPayment(),
// Refunded after Refund::initiate() on a paid booking that was cancelled.
function describe(b) {
  const who = firstName(b.providerName);
  switch (b.paymentStatus) {
    case 'Paid':
      return { label: 'Paid', tone: 'paid', total: 'Paid', amount: b.amount, note: `Paid to ${b.providerName} when the job was completed.` };
    case 'Refunded':
      return {
        label: 'Refunded',
        tone: 'refund',
        total: 'You paid',
        amount: 0,
        refund: true,
        note: `${rupees(b.amount)} refund initiated after you cancelled. It reaches your account in 3 to 5 working days.`,
      };
    case 'Not charged':
      return { label: 'Nothing charged', tone: 'none', total: 'To pay', amount: 0, note: `This booking was ${b.status.toLowerCase()} before any payment was taken.` };
    default:
      return b.status === 'Confirmed'
        ? { label: 'Due after the visit', tone: 'due', total: 'To pay', amount: b.amount, note: `Pay ${who} ${rupees(b.amount)} by UPI or cash once the work is done.` }
        : { label: 'Not due yet', tone: 'due', total: 'To pay', amount: b.amount, note: `Nothing is charged until ${who} accepts and finishes the job.` };
  }
}

export default function PaymentSummary({ booking }) {
  if (!booking) return null;
  const d = describe(booking);

  return (
    <section className="receipt" aria-labelledby="payment-heading">
      <div className="panel-head">
        <h2 id="payment-heading">Payment</h2>
        <span className="count">Booking #{booking.id}</span>
      </div>
      <dl className="receipt-rows">
        <div>
          <dt>{booking.service} visit</dt>
          <dd>{rupees(booking.amount)}</dd>
        </div>
        {d.refund && (
          <div>
            <dt>Refund</dt>
            <dd>−{rupees(booking.amount)}</dd>
          </div>
        )}
        <div className="total">
          <dt>{d.total}</dt>
          <dd>{rupees(d.amount)}</dd>
        </div>
      </dl>
      <p className={`pay-status pay-${d.tone}`}>
        <Receipt size={15} aria-hidden="true" />
        {d.label}
      </p>
      <p className="receipt-note">{d.note}</p>
    </section>
  );
}
