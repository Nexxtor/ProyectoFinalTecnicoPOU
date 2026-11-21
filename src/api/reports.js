import { read } from './client.js';
import { summarizeOrders } from '../utils/reports.js';

export function getReport({ from = '', to = '', eventId = '' } = {}) {
  return read((db) =>
    summarizeOrders(db.orders, db.events, { from, to, eventId })
  );
}
