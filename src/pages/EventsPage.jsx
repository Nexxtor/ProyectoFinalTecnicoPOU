import { useEffect, useState } from 'react';
import { listCategories, listEvents } from '../api/events.js';
import EventCard from '../components/events/EventCard.jsx';
import FormField from '../components/ui/FormField.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAsync } from '../hooks/useAsync.js';

export default function EventsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { status, data: events, error } = useAsync(
    () => listEvents({ query, category }),
    [query, category]
  );

  useEffect(() => {
    let active = true;
    listCategories().then((data) => {
      if (active) setCategories(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Cartelera"
        title="Eventos"
        description="Busca por título, lugar o ciudad y filtra por categoría."
      />
      <div className="filters">
        <FormField label="Buscar" htmlFor="event-query">
          <input
            id="event-query"
            type="search"
            value={query}
            placeholder="Jazz, teatro, estadio..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </FormField>
        <FormField label="Categoría" htmlFor="event-category">
          <select
            id="event-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </FormField>
      </div>

      {status === 'loading' && <StateMessage title="Cargando cartelera..." />}
      {status === 'error' && <StateMessage tone="error" title="No se pudo cargar la cartelera">{error}</StateMessage>}
      {status === 'success' && events.length === 0 && (
        <StateMessage title="No hay eventos">Prueba con otra búsqueda o categoría.</StateMessage>
      )}
      {status === 'success' && events.length > 0 && (
        <div className="event-grid">
          {events.map((event) => <EventCard event={event} key={event.id} />)}
        </div>
      )}
    </div>
  );
}
