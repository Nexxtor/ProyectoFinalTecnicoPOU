import { mutate, read } from './client.js';

export function listEvents({ query = '', category = '', includeDrafts = false } = {}) {
  return read((db) => {
    const term = query.trim().toLowerCase();
    return db.events
      .filter((event) => includeDrafts || event.status !== 'draft')
      .filter((event) => !category || event.category === category)
      .filter(
        (event) =>
          !term ||
          event.title.toLowerCase().includes(term) ||
          event.venue.toLowerCase().includes(term) ||
          event.city.toLowerCase().includes(term)
      )
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
      .map((event) => {
        const eventZones = db.zones.filter((zone) => zone.eventId === event.id);
        return {
          ...event,
          available: eventZones.reduce((sum, zone) => sum + zone.available, 0),
          minPrice: eventZones.length
            ? Math.min(...eventZones.map((zone) => zone.price))
            : 0
        };
      });
  });
}

export function getEvent(id) {
  return read((db) => {
    const event = db.events.find((item) => item.id === Number(id));
    if (!event) throw new Error('Evento no encontrado.');
    return {
      ...event,
      zones: db.zones
        .filter((zone) => zone.eventId === event.id)
        .sort((a, b) => a.price - b.price)
    };
  });
}

export function listCategories() {
  return read((db) => [...new Set(db.events.map((event) => event.category))].sort());
}

export function createEvent(data) {
  return mutate((db) => {
    const event = {
      ...data,
      id: Math.max(0, ...db.events.map((item) => item.id)) + 1,
      createdAt: new Date().toISOString(),
      featured: false
    };
    db.events.push(event);
    const baseId = event.id * 10;
    const defaults = [
      { name: 'General', price: 20, capacity: 100, color: '#7cc4ff' },
      { name: 'Preferente', price: 35, capacity: 50, color: '#f08a01' },
      { name: 'VIP', price: 60, capacity: 20, color: '#9adfa8' }
    ];
    defaults.forEach((zone, index) => {
      db.zones.push({
        id: baseId + index + 1,
        eventId: event.id,
        ...zone,
        available: zone.capacity
      });
    });
    return event;
  });
}

export function updateEvent(id, data) {
  return mutate((db) => {
    const index = db.events.findIndex((item) => item.id === Number(id));
    if (index === -1) throw new Error('Evento no encontrado.');
    db.events[index] = { ...db.events[index], ...data };
    return db.events[index];
  });
}

export function deleteEvent(id) {
  return mutate((db) => {
    const eventId = Number(id);
    db.events = db.events.filter((event) => event.id !== eventId);
    db.zones = db.zones.filter((zone) => zone.eventId !== eventId);
    return { id: eventId };
  });
}

export function updateZone(zoneId, data) {
  return mutate((db) => {
    const zone = db.zones.find((item) => item.id === Number(zoneId));
    if (!zone) throw new Error('Zona no encontrada.');
    Object.assign(zone, data);
    return zone;
  });
}

export function listZonesForEvent(eventId) {
  return read((db) =>
    db.zones
      .filter((zone) => zone.eventId === Number(eventId))
      .sort((a, b) => a.price - b.price)
  );
}
