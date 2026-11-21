import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import FormField from '../components/ui/FormField.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Recuperación</p>
        <h1>Recuperar contraseña</h1>
        <p>El envío de correos es simulado. Se mostrará una confirmación en pantalla.</p>
        {sent ? (
          <StateMessage tone="success" title="Solicitud registrada">
            Si el correo existe, se habría enviado un enlace de recuperación.
          </StateMessage>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSent(true); }}>
            <FormField label="Correo" htmlFor="recover-email">
              <input id="recover-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </FormField>
            <Button type="submit">Enviar enlace</Button>
          </form>
        )}
        <p><Link to="/login">Volver al ingreso</Link></p>
      </section>
    </div>
  );
}
