import { Link } from 'react-router';
import { listEvents } from '../api/events.js';
import EventCard from '../components/events/EventCard.jsx';
import Button from '../components/ui/Button.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAsync } from '../hooks/useAsync.js';

export default function HomePage() {
  const { status, data: events, error } = useAsync(() => listEvents(), []);
  const featured = (events || []).filter((event) => event.featured).slice(0, 3);

  return (
    <div>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Temporada 2026 · 2027</p>
          <h1>Vive los eventos. Compra tus boletos en minutos.</h1>
          <p>
            Conciertos, teatro, deportes y cultura en un solo lugar. Selecciona tu
            zona, paga de forma simulada y recibe tu boleto con código QR.
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/eventos">Explorar eventos</Button>
            <Button as={Link} to="/boletos" variant="secondary">Mis boletos</Button>
          </div>
        </div>
        <div className="hero__card">
          <span className="hero__ticket">BOLETO DIGITAL</span>
          <strong>Eventos UCA</strong>
          <p>Acceso rápido, seguro y disponible sin conexión.</p>
          <span className="hero__qr" aria-hidden="true" />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selección</p>
            <h2>Eventos destacados</h2>
          </div>
          <Link to="/eventos" className="link">Ver todos</Link>
        </div>

        {status === 'loading' && <StateMessage title="Cargando eventos..." />}
        {status === 'error' && <StateMessage tone="error" title="No se pudieron cargar los eventos">{error}</StateMessage>}
        {status === 'success' && (
          <div className="event-grid">
            {featured.map((event) => <EventCard event={event} key={event.id} />)}
          </div>
        )}
      </section>

      <section className="section section--steps">
        <article><span>01</span><h3>Elige tu evento</h3><p>Consulta la cartelera y revisa fechas, lugares y disponibilidad.</p></article>
        <article><span>02</span><h3>Selecciona tu zona</h3><p>Compara precios y cantidades antes de añadir al carrito.</p></article>
        <article><span>03</span><h3>Recibe tu QR</h3><p>Confirma el pago simulado y presenta tu boleto en el acceso.</p></article>
      </section>
    </div>
  );
}
