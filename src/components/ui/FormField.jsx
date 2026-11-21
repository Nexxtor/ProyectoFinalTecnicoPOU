export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <small className="field__hint">{hint}</small>}
      {error && <small className="field__error">{error}</small>}
    </div>
  );
}
