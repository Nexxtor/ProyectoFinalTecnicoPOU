export const initialCart = [];

export function cartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fees = Math.round(subtotal * 0.06 * 100) / 100;
  return {
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Math.round(subtotal * 100) / 100,
    fees,
    total: Math.round((subtotal + fees) * 100) / 100
  };
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = `${action.item.eventId}-${action.item.zoneId}`;
      const existing = state.find(
        (item) => `${item.eventId}-${item.zoneId}` === key
      );
      if (existing) {
        return state.map((item) =>
          `${item.eventId}-${item.zoneId}` === key
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        );
      }
      return [...state, action.item];
    }
    case 'increment':
      return state.map((item) =>
        `${item.eventId}-${item.zoneId}` === action.key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'decrement':
      return state
        .map((item) =>
          `${item.eventId}-${item.zoneId}` === action.key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    case 'remove':
      return state.filter(
        (item) => `${item.eventId}-${item.zoneId}` !== action.key
      );
    case 'clear':
      return [];
    default:
      return state;
  }
}
