import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';

export default function CartPage() {
  const { items, subtotal, fees, total, increment, decrement, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <StateMessage
        title="Tu carrito está vacío"
        action={<Button as={Link} to="/eventos">Explorar eventos</Button>}
      >
        Añade boletos desde la cartelera para continuar.
      </StateMessage>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Compra"
        title="Carrito"
        actions={<Button variant="ghost" onClick={clearCart}>Vaciar carrito</Button>}
      />
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => {
            const key = `${item.eventId}-${item.zoneId}`;
            return (
              <article className="cart-item" key={key}>
                <img src={item.image} alt={item.eventTitle} />
                <div>
                  <h3>{item.eventTitle}</h3>
                  <p>{formatDate(item.eventDate)} · {item.time || item.eventTime}</p>
                  <p>{item.venue} · {item.zoneName}</p>
                </div>
                <div className="quantity">
                  <button type="button" onClick={() => decrement(key)} aria-label="Disminuir">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => increment(key)} aria-label="Aumentar">+</button>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
                <Button variant="ghost" onClick={() => removeItem(key)}>Eliminar</Button>
              </article>
            );
          })}
        </div>
        <aside className="summary">
          <h2>Resumen</h2>
          <p><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></p>
          <p><span>Cargos de servicio</span><strong>{formatCurrency(fees)}</strong></p>
          <p className="summary__total"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
          <Button as={Link} to={isAuthenticated ? '/checkout' : '/login'} state={isAuthenticated ? undefined : { from: '/checkout' }}>
            {isAuthenticated ? 'Continuar al pago' : 'Ingresar para comprar'}
          </Button>
          <small>El pago es simulado. No se procesan tarjetas reales.</small>
        </aside>
      </div>
    </div>
  );
}
