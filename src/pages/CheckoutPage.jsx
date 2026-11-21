import { useState } from 'react';
import { Link } from 'react-router';
import { createOrder } from '../api/orders.js';
import Button from '../components/ui/Button.jsx';
import FormField from '../components/ui/FormField.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';
import { validatePayment } from '../utils/validation.js';
import { assetUrl } from '../utils/assets.js';

export default function CheckoutPage() {
  const { session } = useAuth();
  const { items, subtotal, fees, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ holder: session?.name || '', cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  if (confirmation) {
    return (
      <div className="checkout-confirmation">
        <StateMessage tone="success" title="Compra confirmada">
          Orden #{confirmation.order.id} · {confirmation.tickets.length} boleto(s) generado(s).
        </StateMessage>
        <div className="summary">
          <p><span>Evento</span><strong>{confirmation.eventTitle || 'Evento'}</strong></p>
          <p><span>Total pagado</span><strong>{formatCurrency(confirmation.order.total)}</strong></p>
          <p><span>Método</span><strong>{confirmation.order.paymentMethod}</strong></p>
        </div>
        <div className="actions">
          <Button as={Link} to="/boletos">Ver mis boletos</Button>
          <Button as={Link} to="/eventos" variant="secondary">Seguir explorando</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <StateMessage title="No hay boletos por pagar" action={<Button as={Link} to="/eventos">Ver eventos</Button>} />;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function pay(event) {
    event.preventDefault();
    const validation = validatePayment(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    setRequestError('');
    try {
      const result = await createOrder({
        userId: session.id,
        eventId: items[0].eventId,
        items: items.map((item) => ({ zoneId: item.zoneId, quantity: item.quantity })),
        paymentMethod: `Tarjeta terminada en ${form.cardNumber.slice(-4)}`
      });
      setConfirmation({ ...result, eventTitle: items[0]?.eventTitle });
      clearCart();
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Checkout" title="Finalizar compra" description="El pago es simulado y no procesa datos reales." />
      <ol className="stepper">
        <li className={step >= 1 ? 'is-active' : ''}>1. Revisión</li>
        <li className={step >= 2 ? 'is-active' : ''}>2. Pago</li>
        <li className={step >= 3 ? 'is-active' : ''}>3. Confirmación</li>
      </ol>

      {step === 1 && (
        <div className="checkout-grid">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={`${item.eventId}-${item.zoneId}`}>
                <img src={assetUrl(item.image)} alt={item.eventTitle} />
                <div>
                  <h3>{item.eventTitle}</h3>
                  <p>{formatDate(item.eventDate)} · {item.eventTime}</p>
                  <p>{item.zoneName} · {item.quantity} boleto(s)</p>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Resumen</h2>
            <p><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></p>
            <p><span>Cargos</span><strong>{formatCurrency(fees)}</strong></p>
            <p className="summary__total"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
            <Button type="button" onClick={() => setStep(2)}>Continuar al pago</Button>
          </aside>
        </div>
      )}

      {step === 2 && (
        <form className="payment-form" onSubmit={pay} noValidate>
          <div className="checkout-grid">
            <div>
              <h2>Datos de pago</h2>
              <FormField label="Titular de la tarjeta" htmlFor="holder" error={errors.holder}>
                <input id="holder" value={form.holder} onChange={(event) => update('holder', event.target.value)} autoComplete="cc-name" />
              </FormField>
              <FormField label="Número de tarjeta" htmlFor="cardNumber" error={errors.cardNumber} hint="Usa 16 dígitos de prueba.">
                <input id="cardNumber" value={form.cardNumber} onChange={(event) => update('cardNumber', event.target.value)} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
              </FormField>
              <div className="form-row">
                <FormField label="Vencimiento" htmlFor="expiry" error={errors.expiry}>
                  <input id="expiry" value={form.expiry} onChange={(event) => update('expiry', event.target.value)} placeholder="12/28" autoComplete="cc-exp" />
                </FormField>
                <FormField label="CVV" htmlFor="cvv" error={errors.cvv}>
                  <input id="cvv" value={form.cvv} onChange={(event) => update('cvv', event.target.value)} inputMode="numeric" autoComplete="cc-csc" placeholder="123" />
                </FormField>
              </div>
              {requestError && <StateMessage tone="error" title="No se pudo completar la compra">{requestError}</StateMessage>}
              <div className="actions">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Volver</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Procesando...' : 'Pagar y confirmar'}</Button>
              </div>
            </div>
            <aside className="summary">
              <h2>Total a pagar</h2>
              <p className="summary__total"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
              <small>Pago simulado. No se almacenan datos de tarjeta.</small>
            </aside>
          </div>
        </form>
      )}
    </div>
  );
}
