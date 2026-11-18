import { useEffect, useRef, useState } from 'react';
import { Bell, HardHat, House, Wrench } from 'lucide-react';
import NotificationPanel from './NotificationPanel.jsx';
import { initials } from '../utils.js';

export default function TopBar({ view, onViewChange, connection, userName, notifications, onMarkRead }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  const close = () => {
    setOpen(false);
    onMarkRead();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!wrapRef.current?.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  });

  function switchView(next) {
    if (open) close();
    onViewChange(next);
  }

  const live = connection?.mode === 'live';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Wrench size={18} />
          </span>
          FixFleet
        </div>

        <div className="mode-switch" role="group" aria-label="Dashboard">
          <button type="button" aria-pressed={view === 'customer'} onClick={() => switchView('customer')}>
            <House size={16} aria-hidden="true" />
            Customer
          </button>
          <button type="button" aria-pressed={view === 'provider'} onClick={() => switchView('provider')}>
            <HardHat size={16} aria-hidden="true" />
            Provider
          </button>
        </div>

        {connection && (
          <span
            className={`conn ${live ? 'conn-live' : 'conn-demo'}`}
            title={
              live
                ? `Connected to ${connection.baseUrl}`
                : `Couldn't reach ${connection.baseUrl}. Showing sample data; changes reset when you reload.`
            }
          >
            <span className="conn-dot" aria-hidden="true" />
            {live ? 'Live C++ API' : 'Demo data'}
          </span>
        )}

        <div className="bell-wrap" ref={wrapRef}>
          <button
            type="button"
            className="icon-btn"
            aria-expanded={open}
            aria-controls="notifications"
            aria-label={unread ? `Updates, ${unread} new` : 'Updates'}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <Bell size={19} aria-hidden="true" />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {open && <NotificationPanel id="notifications" items={notifications} />}
        </div>

        <span className="who">
          <span className="avatar avatar-sm" aria-hidden="true">{initials(userName)}</span>
          <span className="who-name">{userName}</span>
        </span>
      </div>
    </header>
  );
}
