import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

function linkClass({ isActive }) {
  return isActive ? 'admin-link admin-link--active' : 'admin-link';
}

export default function AdminLayout() {
  const { session, isAdmin } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/" className="brand brand--light">Eventos<span>UCA</span></NavLink>
        <p className="admin-user">{session?.name}</p>
        <nav className="admin-nav" aria-label="Administración">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/eventos" className={linkClass}>Eventos</NavLink>
          <NavLink to="/admin/inventario" className={linkClass}>Inventario</NavLink>
          {isAdmin && <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>}
          {isAdmin && <NavLink to="/admin/reportes" className={linkClass}>Reportes</NavLink>}
        </nav>
        <NavLink to="/" className="admin-link admin-link--back">← Volver al sitio</NavLink>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
