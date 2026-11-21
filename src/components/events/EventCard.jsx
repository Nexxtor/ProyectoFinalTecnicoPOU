import { Link } from 'react-router';
import Badge from '../ui/Badge.jsx';
import { formatCurrency, formatDate, statusLabel, statusTone } from '../../utils/format.js';

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <Link to={`/eventos/${event.id}`} className="event-card__image">
        <img src={event.image} alt={event.title} loading="lazy" />
        <Badge tone={statusTone(event.status)}>{statusLabel(event.status)}</Badge>
      </Link>
      <div className="event-card__body">
        <p className="eyebrow">{event.category}</p>
        <h3>
          <Link to={`/eventos/${event.id}`}>{event.title}</Link>
        </h3>
        <p className="event-card__meta">
          {formatDate(event.date)} · {event.time}
        </p>
        <p className="event-card__meta">
          {event.venue}, {event.city}
        </p>
        <div className="event-card__footer">
          <span>Desde {formatCurrency(event.minPrice)}</span>
          <span>{event.available} boletos</span>
        </div>
      </div>
    </article>
  );
}
