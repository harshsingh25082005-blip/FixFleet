import { useState } from 'react';
import { ArrowLeft, CircleAlert, ShieldCheck } from 'lucide-react';
import { ServiceIcon } from './icons.jsx';
import { CURRENT_CUSTOMER } from '../demoData.js';
import {
  dayLabel,
  formatHours,
  formatSlot,
  initials,
  isPast,
  rupees,
  slotKey,
  slotsFor,
  upcomingDays,
} from '../utils.js';

export default function ProviderProfile({ provider, taken, onBack, onBook }) {
  const days = upcomingDays(3);
  const slots = slotsFor(provider);
  const takenSet = new Set(taken);
  const slotState = (day, time) => {
    if (isPast(day, time)) return 'past';
    if (takenSet.has(slotKey(day, time))) return 'taken';
    return 'free';
  };
  const firstOpenDay = days.find((d) => slots.some((t) => slotState(d, t) === 'free')) ?? days[0];

  const [day, setDay] = useState(firstOpenDay);
  const [time, setTime] = useState(null);
  const [address, setAddress] = useState(CURRENT_CUSTOMER.address);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  function pickDay(next) {
    setDay(next);
    setTime(null);
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    if (!time) {
      setError('Choose a time for the visit.');
      return;
    }
    if (!address.trim()) {
      setError('Add the address where the work is needed.');
      return;
    }
    setBusy(true);
    setError('');
    setDone(null);
    try {
      const booking = await onBook({
        customerId: CURRENT_CUSTOMER.id,
        customerName: CURRENT_CUSTOMER.name,
        providerId: provider.id,
        service: provider.service,
        date: day,
        time,
        location: address.trim(),
        amount: provider.charge,
      });
      setDone(booking);
      setTime(null);
    } catch (err) {
      // e.g. SlotUnavailableError when someone else took the slot first
      setError(err.message || 'The booking didn’t go through. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="profile" aria-labelledby="profile-name">
      <button type="button" className="back" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to providers
      </button>

      <header className="profile-head">
        <span className="avatar avatar-lg" aria-hidden="true">{initials(provider.name)}</span>
        <div>
          <h1 id="profile-name">{provider.name}</h1>
          <p className="profile-sub">
            <span className="profile-service">
              <ServiceIcon name={provider.service} size={16} />
              {provider.service}
            </span>
            {provider.verified ? (
              <span className="badge-verified">
                <ShieldCheck size={16} aria-hidden="true" />
                Verified by FixFleet
              </span>
            ) : (
              <span className="badge-unverified">
                <CircleAlert size={16} aria-hidden="true" />
                Verification pending
              </span>
            )}
          </p>
        </div>
      </header>

      <dl className="facts">
        <div>
          <dt>Experience</dt>
          <dd>{provider.experience} years</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>
            {provider.rating} from {provider.jobsDone} jobs
          </dd>
        </div>
        <div>
          <dt>Working hours</dt>
          <dd>{formatHours(provider.workingHours)}</dd>
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

      {provider.about && <p className="about">{provider.about}</p>}
      {provider.skills?.length > 0 && (
        <ul className="skills" aria-label="Skills">
          {provider.skills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}

      <form className="book-form" onSubmit={submit} noValidate>
        <h2>Book a visit</h2>

        <fieldset>
          <legend>Day</legend>
          <div className="chips chips-days">
            {days.map((d) => {
              const free = slots.filter((t) => slotState(d, t) === 'free').length;
              return (
                <button
                  key={d}
                  type="button"
                  className="chip day-chip"
                  aria-pressed={day === d}
                  onClick={() => pickDay(d)}
                >
                  {dayLabel(d)}
                  <small>{free === 0 ? 'Full' : `${free} free`}</small>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend>Time</legend>
          <div className="chips">
            {slots.map((t) => {
              const state = slotState(day, t);
              return (
                <button
                  key={t}
                  type="button"
                  className="chip"
                  aria-pressed={time === t}
                  disabled={state !== 'free'}
                  title={state === 'taken' ? 'Already booked' : state === 'past' ? 'Too late to book' : undefined}
                  onClick={() => {
                    setTime(t);
                    setError('');
                  }}
                >
                  {t}
                  {state === 'taken' && <span className="sr-only"> (booked)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label className="field-label" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="text-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
          />
        </div>

        <p className="charge-note">
          Visit charge {rupees(provider.charge)}, set by FixFleet. Nothing is charged until{' '}
          {provider.name.split(' ')[0]} accepts, and you pay after the job is done.
        </p>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {done && !error && (
          <p className="form-done" role="status">
            Visit requested for {formatSlot(done.date, done.time)}. Track it under Your bookings.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Booking…' : `Book visit for ${rupees(provider.charge)}`}
        </button>
      </form>
    </article>
  );
}
