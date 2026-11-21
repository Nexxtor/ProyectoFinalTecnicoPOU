export function summarizeOrders(orders, events, { from = '', to = '', eventId = '' } = {}) {
  const paid = orders.filter((order) => order.status === 'paid');
  const filtered = paid.filter((order) => {
    const date = order.createdAt.slice(0, 10);
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (eventId && order.eventId !== Number(eventId)) return false;
    return true;
  });

  const revenue = filtered.reduce((sum, order) => sum + order.total, 0);
  const tickets = filtered.reduce(
    (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
    0
  );

  const byEvent = events
    .map((event) => {
      const eventOrders = filtered.filter((order) => order.eventId === event.id);
      const eventRevenue = eventOrders.reduce((sum, order) => sum + order.total, 0);
      const eventTickets = eventOrders.reduce(
        (sum, order) =>
          sum + order.items.reduce((count, item) => count + item.quantity, 0),
        0
      );
      return {
        eventId: event.id,
        title: event.title,
        orders: eventOrders.length,
        tickets: eventTickets,
        revenue: Math.round(eventRevenue * 100) / 100
      };
    })
    .filter((item) => item.orders > 0)
    .sort((a, b) => b.revenue - a.revenue);

  return {
    orders: filtered.length,
    tickets,
    revenue: Math.round(revenue * 100) / 100,
    averageTicket: tickets ? Math.round((revenue / tickets) * 100) / 100 : 0,
    byEvent
  };
}
