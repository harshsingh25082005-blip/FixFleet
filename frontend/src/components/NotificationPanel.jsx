import { timeAgo } from '../utils.js';

// One entry per Notification::send() in the C++ code.
export default function NotificationPanel({ id, items }) {
  return (
    <div className="notif-panel" id={id} role="region" aria-label="Updates">
      <h2 className="notif-title">Updates</h2>
      {items.length === 0 ? (
        <p className="notif-empty">No updates yet. Changes to your bookings show up here.</p>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.id} className={n.read ? undefined : 'is-unread'}>
              <p>{n.text}</p>
              <time dateTime={new Date(n.at).toISOString()}>{timeAgo(n.at)}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
