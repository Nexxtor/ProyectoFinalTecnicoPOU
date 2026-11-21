import { read } from './client.js';

export function listTicketsByUser(userId) {
  return read((db) =>
    db.tickets
      .filter((ticket) => {
        const order = db.orders.find((candidate) => candidate.id === ticket.orderId);
        return order?.userId === Number(userId);
      })
      .map((ticket) => {
        const event = db.events.find((candidate) => candidate.id === ticket.eventId);
        return {
          ...ticket,
          eventTitle: event?.title,
          eventDate: event?.date,
          eventTime: event?.time,
          venue: event?.venue,
          city: event?.city
        };
      })
      .sort((a, b) => `${a.eventDate}${a.eventTime}`.localeCompare(`${b.eventDate}${b.eventTime}`))
  );
}

export function getTicket(id) {
  return read((db) => {
    const ticket = db.tickets.find((item) => item.id === Number(id));
    if (!ticket) throw new Error('Boleto no encontrado.');
    const event = db.events.find((candidate) => candidate.id === ticket.eventId);
    return {
      ...ticket,
      eventTitle: event?.title,
      eventDate: event?.date,
      eventTime: event?.time,
      venue: event?.venue,
      city: event?.city
    };
  });
}

export function listTicketsByOrder(orderId) {
  return read((db) => db.tickets.filter((ticket) => ticket.orderId === Number(orderId)));
}
