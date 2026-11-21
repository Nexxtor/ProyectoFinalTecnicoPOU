import { useState } from 'react';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/format.js';

export default function ZoneSelector({ event, onAdd }) {
  const [quantities, setQuantities] = useState({});

  function setQuantity(zoneId, value) {
    setQuantities((current) => ({
      ...current,
      [zoneId]: Math.max(0, Math.min(value, 8))
    }));
  }

  function addSelected() {
    event.zones.forEach((zone) => {
      const quantity = quantities[zone.id] || 0;
      if (quantity > 0) {
        onAdd({
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          venue: event.venue,
          image: event.image,
          zoneId: zone.id,
          zoneName: zone.name,
          price: zone.price,
          quantity
        });
      }
    });
    setQuantities({});
  }

  const total = event.zones.reduce(
    (sum, zone) => sum + zone.price * (quantities[zone.id] || 0),
    0
  );

  return (
    <section className="zones">
      <h2>Selecciona tus boletos</h2>
      <div className="zones__list">
        {event.zones.map((zone) => (
          <article className="zone" key={zone.id}>
            <div>
              <span className="zone__color" style={{ background: zone.color }} />
              <strong>{zone.name}</strong>
              <p>{zone.available} disponibles</p>
            </div>
            <span className="zone__price">{formatCurrency(zone.price)}</span>
            <label className="zone__quantity">
              Cantidad
              <input
                type="number"
                min="0"
                max="8"
                value={quantities[zone.id] || 0}
                onChange={(event) => setQuantity(zone.id, Number(event.target.value))}
                disabled={zone.available === 0}
                aria-label={`Cantidad para ${zone.name}`}
              />
            </label>
          </article>
        ))}
      </div>
      <div className="zones__footer">
        <strong>Total: {formatCurrency(total)}</strong>
        <Button type="button" onClick={addSelected} disabled={total === 0}>
          Añadir al carrito
        </Button>
      </div>
    </section>
  );
}
