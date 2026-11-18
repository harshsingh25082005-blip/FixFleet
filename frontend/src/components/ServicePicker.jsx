import { ServiceIcon } from './icons.jsx';

export default function ServicePicker({ services, providers, selected, onSelect }) {
  return (
    <ul className="service-rack" aria-label="Services">
      {services.map((s) => {
        const count = providers.filter((p) => p.service === s.name).length;
        return (
          <li key={s.id}>
            <button
              type="button"
              className="service"
              aria-pressed={selected === s.name}
              onClick={() => onSelect(s.name)}
            >
              <ServiceIcon name={s.name} size={22} />
              <span className="service-name">{s.name}</span>
              <span className="service-blurb">{s.blurb}</span>
              <span className="service-count">{count === 1 ? '1 provider' : `${count} providers`}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
