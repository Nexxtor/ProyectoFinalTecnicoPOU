import { useEffect, useState } from 'react';
import { listEvents, listZonesForEvent, updateZone } from '../../api/events.js';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { formatCurrency } from '../../utils/format.js';

export default function AdminInventoryPage() {
  const events = useAsync(() => listEvents({ includeDrafts: true }), []);
  const [selectedId, setSelectedId] = useState('');
  const zones = useAsync(
    () => (selectedId ? listZonesForEvent(selectedId) : Promise.resolve([])),
    [selectedId]
  );
  const [draft, setDraft] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (events.data?.length && !selectedId) setSelectedId(String(events.data[0].id));
  }, [events.data, selectedId]);

  useEffect(() => {
    if (zones.data) setDraft(zones.data.map((zone) => ({ ...zone })));
  }, [zones.data]);

  function update(index, field, value) {
    setDraft((current) => current.map((zone, position) => (
      position === index ? { ...zone, [field]: Number(value) } : zone
    )));
  }

  async function save(zone) {
    setMessage('');
    setError('');
    try {
      await updateZone(zone.id, {
        price: Number(zone.price),
        capacity: Number(zone.capacity),
        available: Number(zone.available)
      });
      setMessage(`Zona ${zone.name} actualizada.`);
      zones.reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (events.status === 'loading') return <StateMessage title="Cargando inventario..." />;
  if (events.status === 'error') return <StateMessage tone="error" title="No se pudo cargar el inventario">{events.error}</StateMessage>;

  return (
    <div>
      <PageHeader eyebrow="Administración" title="Inventario y precios" description="Ajusta precios, capacidad y disponibilidad por zona." />
      <FormField label="Evento" htmlFor="inventory-event">
        <select id="inventory-event" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {events.data.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
        </select>
      </FormField>

      {zones.status === 'loading' && <StateMessage title="Cargando zonas..." />}
      {message && <StateMessage tone="success" title={message} />}
      {error && <StateMessage tone="error" title="No se pudo guardar">{error}</StateMessage>}

      {zones.status === 'success' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Zona</th><th>Precio</th><th>Capacidad</th><th>Disponibles</th><th>Acción</th></tr></thead>
            <tbody>
              {draft.map((zone, index) => (
                <tr key={zone.id}>
                  <td><span className="color-dot" style={{ background: zone.color }} />{zone.name}</td>
                  <td><input type="number" min="0" step="0.01" value={zone.price} onChange={(event) => update(index, 'price', event.target.value)} aria-label={`Precio de ${zone.name}`} /></td>
                  <td><input type="number" min="0" value={zone.capacity} onChange={(event) => update(index, 'capacity', event.target.value)} aria-label={`Capacidad de ${zone.name}`} /></td>
                  <td><input type="number" min="0" value={zone.available} onChange={(event) => update(index, 'available', event.target.value)} aria-label={`Disponibles de ${zone.name}`} /></td>
                  <td><Button className="btn--small" onClick={() => save(zone)}>Guardar</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted">Los cambios se guardan en localStorage. El total del evento se recalcula al consultar la cartelera.</p>
    </div>
  );
}
