import { listUsers } from '../../api/auth.js';
import Badge from '../../components/ui/Badge.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';

const roleLabels = { client: 'Cliente', organizer: 'Organizador', admin: 'Administrador' };

export default function AdminUsersPage() {
  const { status, data: users, error } = useAsync(() => listUsers(), []);

  return (
    <div>
      <PageHeader eyebrow="Administración" title="Usuarios" description="Consulta las cuentas y sus roles." />
      {status === 'loading' && <StateMessage title="Cargando usuarios..." />}
      {status === 'error' && <StateMessage tone="error" title="No se pudieron cargar los usuarios">{error}</StateMessage>}
      {status === 'success' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><Badge tone={user.role === 'admin' ? 'warning' : 'neutral'}>{roleLabels[user.role]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
