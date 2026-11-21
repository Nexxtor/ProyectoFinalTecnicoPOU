import { describe, expect, it } from 'vitest';
import { summarizeOrders } from '../utils/reports.js';

const events = [
  { id: 1, title: 'Jazz' },
  { id: 2, title: 'Teatro' }
];

const orders = [
  {
    id: 1,
    eventId: 1,
    status: 'paid',
    total: 100,
    createdAt: '2026-11-01T10:00:00.000Z',
    items: [{ quantity: 2 }]
  },
  {
    id: 2,
    eventId: 1,
    status: 'paid',
    total: 50,
    createdAt: '2026-11-02T10:00:00.000Z',
    items: [{ quantity: 1 }]
  },
  {
    id: 3,
    eventId: 2,
    status: 'pending',
    total: 999,
    createdAt: '2026-11-03T10:00:00.000Z',
    items: [{ quantity: 5 }]
  }
];

describe('summarizeOrders', () => {
  it('solo incluye órdenes pagadas y agrupa por evento', () => {
    const report = summarizeOrders(orders, events);
    expect(report.orders).toBe(2);
    expect(report.tickets).toBe(3);
    expect(report.revenue).toBe(150);
    expect(report.byEvent).toEqual([
      { eventId: 1, title: 'Jazz', orders: 2, tickets: 3, revenue: 150 }
    ]);
  });

  it('filtra por fecha y evento', () => {
    const report = summarizeOrders(orders, events, {
      from: '2026-11-02',
      to: '2026-11-02',
      eventId: '1'
    });
    expect(report.orders).toBe(1);
    expect(report.revenue).toBe(50);
  });
});
