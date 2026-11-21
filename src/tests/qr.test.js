import { describe, expect, it } from 'vitest';
import { buildTicketPayload, ticketDisplayCode } from '../utils/qr.js';

describe('payload del QR', () => {
  it('usa el payload del boleto y su código visible', () => {
    const ticket = {
      id: 9,
      orderId: 1001,
      code: 'EV-1001-9',
      qrPayload: 'EVENTOS-UCA|ORDER:1001|TICKET:9|EVENT:1'
    };
    expect(buildTicketPayload(ticket)).toBe(ticket.qrPayload);
    expect(ticketDisplayCode(ticket)).toBe('EV-1001-9');
  });

  it('construye un payload de respaldo', () => {
    expect(buildTicketPayload({ id: 5, orderId: 20 })).toBe(
      'EVENTOS-UCA|TICKET:5|ORDER:20'
    );
  });
});
