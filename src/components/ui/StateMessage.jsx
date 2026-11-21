export default function StateMessage({ tone = 'info', title, children, action }) {
  return (
    <div className={`state state--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <strong>{title}</strong>}
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
