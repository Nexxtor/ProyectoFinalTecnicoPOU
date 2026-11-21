import { Link } from 'react-router';
import { deleteEvent, listEvents } from '../../api/events.js';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { formatDate, formatCurrency, statusLabel, statusTone } from '../../utils/format.js';

export default function AdminEventsPage() {
  const { status, data: events, error, reload } = useAsync(() => listEvents({ includeDrafts: true }), []);

  async function remove(event) {
    if (!window.confirm(`¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`)) return;
    await deleteEvent(event.id);
    reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Eventos"
        description="Crea, edita y publica los eventos de la plataforma."
        actions={<Button as={Link} to="/admin/eventos/nuevo">Nuevo evento</Button>}
      />
      {status === 'loading' && <StateMessage title="Cargando eventos..." />}
      {status === 'error' && <StateMessage tone="error" title="No se pudieron cargar los eventos">{error}</StateMessage>}
      {status === 'success' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Evento</th><th>Fecha</th><th>Estado</th><th>Desde</th><th>Acciones</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
                    <small>{event.venue}, {event.city}</small>
                  </td>
                  <td>{formatDate(event.date)}</td>
                  <td><Badge tone={statusTone(event.status)}>{statusLabel(event.status)}</Badge></td>
                  <td>{formatCurrency(event.minPrice)}</td>
                  <td className="table-actions">
                    <Button as={Link} to={`/admin/eventos/${event.id}`} variant="secondary" className="btn--small">Editar</Button>
                    <Button variant="danger" className="btn--small" onClick={() => remove(event)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
