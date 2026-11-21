import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import InstallButton from '../components/ui/InstallButton.jsx';
import PwaStatus from '../components/ui/PwaStatus.jsx';

function navClass({ isActive }) {
  return isActive ? 'nav-link nav-link--active' : 'nav-link';
}

export default function PublicLayout() {
  const { session, isOrganizer, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <PwaStatus />
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            Eventos<span>UCA</span>
          </Link>
          <nav className="site-nav" aria-label="Navegación principal">
            <NavLink to="/" end className={navClass}>Inicio</NavLink>
            <NavLink to="/eventos" className={navClass}>Eventos</NavLink>
            <NavLink to="/carrito" className={navClass}>Carrito ({count})</NavLink>
            {session && <NavLink to="/boletos" className={navClass}>Boletos</NavLink>}
            {isOrganizer && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
            {session ? (
              <>
                <NavLink to="/perfil" className={navClass}>{session.name.split(' ')[0]}</NavLink>
                <button
                  type="button"
                  className="nav-link nav-link--button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>Ingresar</NavLink>
                <NavLink to="/registro" className={navClass}>Crear cuenta</NavLink>
              </>
            )}
            <InstallButton />
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Eventos UCA · Solución de referencia del proyecto</p>
          <p>Datos simulados con fines educativos.</p>
        </div>
      </footer>
    </div>
  );
}
