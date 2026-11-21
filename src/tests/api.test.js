import { beforeEach, describe, expect, it } from 'vitest';
import { login } from '../api/auth.js';
import { listEvents } from '../api/events.js';
import { createOrder } from '../api/orders.js';
import { resetDb, STORAGE_KEY } from '../api/client.js';
import { getReport } from '../api/reports.js';
import { listTicketsByUser } from '../api/tickets.js';

const fixture = {
  version: 1,
  users: [
    { id: 1, name: 'Ana', email: 'ana@test.com', password: 'secreto', role: 'client', avatar: 'A' }
  ],
  events: [
    {
      id: 1,
      title: 'Jazz',
      category: 'Música',
      date: '2027-01-10',
      time: '19:00',
      venue: 'Teatro',
      city: 'San Salvador',
      description: 'Concierto',
      image: '/images/event-1.svg',
      status: 'published',
      organizerId: 1,
      featured: true
    }
  ],
  zones: [
    { id: 11, eventId: 1, name: 'General', price: 10, capacity: 100, available: 100, color: '#fff' }
  ],
  orders: [],
  tickets: []
};

beforeEach(() => {
  localStorage.clear();
  resetDb();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fixture));
});

describe('API falsa', () => {
  it('inicia sesión con un usuario semilla', async () => {
    const user = await login({ email: 'ana@test.com', password: 'secreto' });
    expect(user.name).toBe('Ana');
    expect(user.password).toBeUndefined();
  });

  it('lista eventos publicados con precio mínimo y disponibilidad', async () => {
    const events = await listEvents();
    expect(events).toHaveLength(1);
    expect(events[0].minPrice).toBe(10);
    expect(events[0].available).toBe(100);
  });

  it('crea una orden, descuenta disponibilidad y genera boletos', async () => {
    const result = await createOrder({
      userId: 1,
      eventId: 1,
      items: [{ zoneId: 11, quantity: 2 }],
      paymentMethod: 'Tarjeta de prueba'
    });
    expect(result.order.total).toBe(21.2);
    expect(result.tickets).toHaveLength(2);
    const tickets = await listTicketsByUser(1);
    expect(tickets).toHaveLength(2);
    const events = await listEvents();
    expect(events[0].available).toBe(98);
  });

  it('genera un reporte con las órdenes pagadas', async () => {
    await createOrder({
      userId: 1,
      eventId: 1,
      items: [{ zoneId: 11, quantity: 1 }],
      paymentMethod: 'Tarjeta de prueba'
    });
    const report = await getReport();
    expect(report.orders).toBe(1);
    expect(report.tickets).toBe(1);
    expect(report.revenue).toBe(10.6);
  });
});
