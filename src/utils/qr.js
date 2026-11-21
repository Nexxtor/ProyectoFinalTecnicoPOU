export function buildTicketPayload(ticket) {
  return ticket.qrPayload || `EVENTOS-UCA|TICKET:${ticket.id}|ORDER:${ticket.orderId}`;
}

export function ticketDisplayCode(ticket) {
  return ticket.code || `EV-${ticket.orderId}-${ticket.id}`;
}
