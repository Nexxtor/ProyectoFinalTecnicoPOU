import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getEvent } from '../api/events.js';
import ZoneSelector from '../components/events/ZoneSelector.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { formatDate, statusLabel, statusTone } from '../utils/format.js';
import { assetUrl } from '../utils/assets.js';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { status, data: event, error } = useAsync(() => getEvent(id), [id]);

  if (status === 'loading') return <StateMessage title="Cargando evento..." />;
  if (status === 'error') {
    return (
      <StateMessage tone="error" title="No se pudo cargar el evento" action={<Button as={Link} to="/eventos">Volver</Button>}>
        {error}
      </StateMessage>
    );
  }

  function handleAdd(item) {
    addItem(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <article className="event-detail">
      <Link to="/eventos" className="link">← Volver a la cartelera</Link>
      <div className="event-detail__hero" style={{ backgroundImage: `url(${assetUrl(event.image)})` }}>
        <div className="event-detail__overlay">
          <Badge tone={statusTone(event.status)}>{statusLabel(event.status)}</Badge>
          <p className="eyebrow">{event.category}</p>
          <h1>{event.title}</h1>
          <p>{formatDate(event.date)} · {event.time}</p>
          <p>{event.venue}, {event.city}</p>
        </div>
      </div>

      <div className="event-detail__grid">
        <div>
          <h2>Sobre el evento</h2>
          <p>{event.description}</p>
          <dl className="detail-list">
            <div><dt>Fecha</dt><dd>{formatDate(event.date)}</dd></div>
            <div><dt>Hora</dt><dd>{event.time}</dd></div>
            <div><dt>Lugar</dt><dd>{event.venue}</dd></div>
            <div><dt>Ciudad</dt><dd>{event.city}</dd></div>
          </dl>
        </div>
        <div>
          {event.status === 'soldout' || event.zones.every((zone) => zone.available === 0) ? (
            <StateMessage title="Evento agotado">No hay boletos disponibles para este evento.</StateMessage>
          ) : (
            <ZoneSelector event={event} onAdd={handleAdd} />
          )}
          {added && (
            <StateMessage tone="success" title="Añadido al carrito" action={<Button type="button" onClick={() => navigate('/carrito')}>Ver carrito</Button>} />
          )}
        </div>
      </div>
    </article>
  );
}
