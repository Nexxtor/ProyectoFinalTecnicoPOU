import { describe, expect, it } from 'vitest';
import { cartReducer, cartTotals } from '../context/cartReducer.js';

const item = {
  eventId: 1,
  zoneId: 11,
  price: 10,
  quantity: 2
};

describe('cartReducer', () => {
  it('añade un item nuevo', () => {
    expect(cartReducer([], { type: 'add', item })).toEqual([item]);
  });

  it('fusiona la cantidad si el item ya existe', () => {
    const result = cartReducer([item], {
      type: 'add',
      item: { ...item, quantity: 3 }
    });
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it('incrementa, decrementa y elimina por clave', () => {
    const key = '1-11';
    const incremented = cartReducer([item], { type: 'increment', key });
    expect(incremented[0].quantity).toBe(3);
    const decremented = cartReducer(incremented, { type: 'decrement', key });
    expect(decremented[0].quantity).toBe(2);
    const removed = cartReducer([item], { type: 'remove', key });
    expect(removed).toHaveLength(0);
  });

  it('elimina el item cuando la cantidad llega a cero', () => {
    const result = cartReducer([{ ...item, quantity: 1 }], {
      type: 'decrement',
      key: '1-11'
    });
    expect(result).toHaveLength(0);
  });

  it('calcula subtotal, cargos y total', () => {
    const totals = cartTotals([item, { ...item, zoneId: 12, price: 20, quantity: 1 }]);
    expect(totals.count).toBe(3);
    expect(totals.subtotal).toBe(40);
    expect(totals.fees).toBe(2.4);
    expect(totals.total).toBe(42.4);
  });
});
