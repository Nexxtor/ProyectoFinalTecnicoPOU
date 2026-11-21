import { mutate, read } from './client.js';

function nextId(items) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export function createOrder({ userId, eventId, items, paymentMethod }) {
  return mutate((db) => {
    const event = db.events.find((item) => item.id === Number(eventId));
    if (!event) throw new Error('Evento no encontrado.');
    if (!items.length) throw new Error('El carrito está vacío.');

    const orderItems = items.map((item) => {
      const zone = db.zones.find(
        (candidate) => candidate.id === Number(item.zoneId) && candidate.eventId === Number(eventId)
      );
      if (!zone) throw new Error('Zona no encontrada.');
      if (zone.available < item.quantity) {
        throw new Error(`No hay suficientes boletos en ${zone.name}.`);
      }
      return {
        zoneId: zone.id,
        zoneName: zone.name,
        quantity: item.quantity,
        unitPrice: zone.price
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const fees = Math.round(subtotal * 0.06 * 100) / 100;
    const orderId = nextId(db.orders);
    const order = {
      id: orderId,
      userId: Number(userId),
      eventId: Number(eventId),
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      fees,
      total: Math.round((subtotal + fees) * 100) / 100,
      status: 'paid',
      paymentMethod,
      createdAt: new Date().toISOString()
    };
    db.orders.push(order);

    const createdTickets = [];
    for (const item of orderItems) {
      const zone = db.zones.find((candidate) => candidate.id === item.zoneId);
      zone.available -= item.quantity;
      for (let count = 0; count < item.quantity; count += 1) {
        const ticketId = nextId(db.tickets);
        const ticket = {
          id: ticketId,
          orderId,
          eventId: Number(eventId),
          zoneId: item.zoneId,
          zoneName: item.zoneName,
          code: `EV-${orderId}-${ticketId}`,
          qrPayload: `EVENTOS-UCA|ORDER:${orderId}|TICKET:${ticketId}|EVENT:${eventId}`,
          holderName: db.users.find((user) => user.id === Number(userId))?.name || 'Titular',
          status: 'valid'
        };
        db.tickets.push(ticket);
        createdTickets.push(ticket);
      }
    }

    return { order, tickets: createdTickets };
  });
}

export function listOrdersByUser(userId) {
  return read((db) =>
    db.orders
      .filter((order) => order.userId === Number(userId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function listAllOrders() {
  return read((db) => [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function getOrder(id) {
  return read((db) => {
    const order = db.orders.find((item) => item.id === Number(id));
    if (!order) throw new Error('Orden no encontrada.');
    return order;
  });
}
