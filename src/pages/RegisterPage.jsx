import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../components/ui/Button.jsx';
import FormField from '../components/ui/FormField.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Completa los campos y usa una contraseña de al menos 6 caracteres.');
      return;
    }
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Cuenta nueva</p>
        <h1>Crear cuenta</h1>
        <p>La cuenta se crea como cliente. Los roles administrativos son de demostración.</p>
        <form onSubmit={submit} noValidate>
          <FormField label="Nombre completo" htmlFor="name">
            <input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" />
          </FormField>
          <FormField label="Correo" htmlFor="email">
            <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" hint="Mínimo 6 caracteres.">
            <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" />
          </FormField>
          {error && <StateMessage tone="error" title="No se pudo crear la cuenta">{error}</StateMessage>}
          <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</Button>
        </form>
        <p><Link to="/login">Ya tengo una cuenta</Link></p>
      </section>
    </div>
  );
}
