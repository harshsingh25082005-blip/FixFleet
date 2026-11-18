import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { formatSlot, initials, nextFreeSlot, rupees } from '../utils.js';

export default function ProviderList({ heading, providers, takenSlots, onOpen }) {
  return (
    <section className="providers" aria-labelledby="providers-heading">
      <div className="section-head">
        <h2 id="providers-heading">{heading}</h2>
        <span className="count">{providers.length === 1 ? '1 available' : `${providers.length} available`}</span>
      </div>

      {providers.length === 0 ? (
        <p className="empty">Nobody matches that search. Try a skill like “wiring” or an area like “Sector 21”.</p>
      ) : (
        <ul className="provider-list">
          {providers.map((p) => {
            const next = nextFreeSlot(p, takenSlots[p.id] ?? []);
            return (
              <li key={p.id}>
                <button type="button" className="provider-row" onClick={() => onOpen(p.id)}>
                  <span className="avatar" aria-hidden="true">{initials(p.name)}</span>
                  <span className="provider-main">
                    <span className="provider-name">
                      {p.name}
                      {p.verified && (
                        <span className="verified" title="Verified by FixFleet">
                          <ShieldCheck size={16} aria-hidden="true" />
                          <span className="sr-only">Verified</span>
                        </span>
                      )}
                    </span>
                    <span className="provider-meta">
                      <span>{p.service}</span>
                      <span>{p.experience} yrs experience</span>
                      <span className="rating">
                        <Star size={14} aria-hidden="true" />
                        {p.rating} ({p.jobsDone} jobs)
                      </span>
                    </span>
                    <span className="provider-area">
                      <MapPin size={14} aria-hidden="true" />
                      {p.area}
                    </span>
                  </span>
                  <span className="provider-side">
                    <span className="charge">
                      {rupees(p.charge)} <small>visit</small>
                    </span>
                    {next ? (
                      <span className="tool-tag">Next free {formatSlot(next.date, next.time)}</span>
                    ) : (
                      <span className="booked-out">Booked for the next 3 days</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
