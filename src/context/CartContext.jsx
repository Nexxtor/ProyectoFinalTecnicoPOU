import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cartReducer, cartTotals, initialCart } from './cartReducer.js';

const STORAGE_KEY = 'eventos-cart-v1';
const CartContext = createContext(null);

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCart;
  } catch {
    return initialCart;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totals = useMemo(() => cartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      ...totals,
      addItem: (item) => dispatch({ type: 'add', item }),
      increment: (key) => dispatch({ type: 'increment', key }),
      decrement: (key) => dispatch({ type: 'decrement', key }),
      removeItem: (key) => dispatch({ type: 'remove', key }),
      clearCart: () => dispatch({ type: 'clear' })
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
