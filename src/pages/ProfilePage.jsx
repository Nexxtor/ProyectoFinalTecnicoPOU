import { listOrdersByUser } from '../api/orders.js';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { resetDb } from '../api/client.js';
import { useAsync } from '../hooks/useAsync.js';
import { formatCurrency, formatDateTime, statusLabel } from '../utils/format.js';

export default function ProfilePage() {
  const { session, logout } = useAuth();
  const { status, data: orders } = useAsync(() => listOrdersByUser(session.id), [session.id]);

  function reset() {
    if (!window.confirm('¿Restablecer los datos de demostración? Se perderán los cambios locales.')) return;
    resetDb();
    window.location.href = '/';
  }

  return (
    <div>
      <PageHeader
        eyebrow="Mi cuenta"
        title="Perfil"
        actions={<Button variant="secondary" onClick={logout}>Cerrar sesión</Button>}
      />
      <div className="profile-grid">
        <section className="profile-card">
          <span className="avatar">{session.avatar}</span>
          <h2>{session.name}</h2>
          <p>{session.email}</p>
          <p className="muted">Rol: {session.role}</p>
        </section>
        <section>
          <h2>Historial de compras</h2>
          {status === 'loading' && <StateMessage title="Cargando compras..." />}
          {status === 'success' && orders.length === 0 && <StateMessage title="Sin compras registradas" />}
          {status === 'success' && orders.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      <td>{statusLabel(order.status)}</td>
                      <td>{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <section className="section">
        <h2>Datos de demostración</h2>
        <p>La aplicación guarda los cambios en localStorage. Puedes restaurar los datos iniciales.</p>
        <Button variant="danger" onClick={reset}>Restablecer datos</Button>
      </section>
    </div>
  );
}
