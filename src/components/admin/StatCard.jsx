import { Link } from 'react-router';

export default function StatCard({ label, value, hint, to }) {
  const content = (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
