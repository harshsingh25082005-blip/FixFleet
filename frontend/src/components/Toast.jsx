export default function Toast({ toast }) {
  return (
    <div className="toast-region" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : undefined}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
