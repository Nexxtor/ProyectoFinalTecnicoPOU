import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Button from '../components/ui/Button.jsx';
import FormField from '../components/ui/FormField.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLogin } from '../utils/validation.js';

const demoUsers = [
  { label: 'Cliente', email: 'cliente@eventos.test', password: 'cliente123' },
  { label: 'Organizador', email: 'organizador@eventos.test', password: 'organizador123' },
  { label: 'Administrador', email: 'admin@eventos.test', password: 'admin123' }
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const validation = validateLogin(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setRequestError('');
    try {
      const user = await login(form);
      const from = location.state?.from;
      navigate(from || (['admin', 'organizer'].includes(user.role) ? '/admin' : '/'), { replace: true });
    } catch (error) {
      setRequestError(error.message);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Acceso</p>
        <h1>Ingresar</h1>
        <p>Usa una cuenta de demostración o tus credenciales registradas.</p>
        <form onSubmit={submit} noValidate>
          <FormField label="Correo" htmlFor="email" error={errors.email}>
            <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" error={errors.password}>
            <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" />
          </FormField>
          {requestError && <StateMessage tone="error" title="No se pudo ingresar">{requestError}</StateMessage>}
          <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
        </form>
        <p><Link to="/recuperar">¿Olvidaste tu contraseña?</Link> · <Link to="/registro">Crear cuenta</Link></p>
      </section>
      <aside className="demo-card">
        <h2>Cuentas de demostración</h2>
        {demoUsers.map((user) => (
          <button key={user.email} type="button" onClick={() => setForm({ email: user.email, password: user.password })}>
            <strong>{user.label}</strong>
            <span>{user.email}</span>
          </button>
        ))}
      </aside>
    </div>
  );
}
