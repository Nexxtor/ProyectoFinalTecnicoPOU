import { createBrowserRouter } from 'react-router';
import { RequireAuth, RequireRole } from './components/auth/RouteGuards.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import PublicLayout from './layout/PublicLayout.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminEventFormPage from './pages/admin/AdminEventFormPage.jsx';
import AdminEventsPage from './pages/admin/AdminEventsPage.jsx';
import AdminInventoryPage from './pages/admin/AdminInventoryPage.jsx';
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PublicLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'eventos', element: <EventsPage /> },
        { path: 'eventos/:id', element: <EventDetailPage /> },
        { path: 'carrito', element: <CartPage /> },
        { path: 'checkout', element: <RequireAuth><CheckoutPage /></RequireAuth> },
        { path: 'boletos', element: <RequireAuth><TicketsPage /></RequireAuth> },
        { path: 'perfil', element: <RequireAuth><ProfilePage /></RequireAuth> },
        { path: 'login', element: <LoginPage /> },
        { path: 'registro', element: <RegisterPage /> },
        { path: 'recuperar', element: <ForgotPasswordPage /> },
        { path: '*', element: <NotFoundPage /> }
      ]
    },
    {
      path: '/admin',
      element: (
        <RequireRole roles={['admin', 'organizer']}>
          <AdminLayout />
        </RequireRole>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'eventos', element: <AdminEventsPage /> },
        { path: 'eventos/nuevo', element: <AdminEventFormPage /> },
        { path: 'eventos/:id', element: <AdminEventFormPage /> },
        { path: 'inventario', element: <AdminInventoryPage /> },
        { path: 'usuarios', element: <RequireRole roles={['admin']}><AdminUsersPage /></RequireRole> },
        { path: 'reportes', element: <RequireRole roles={['admin']}><AdminReportsPage /></RequireRole> }
      ]
    }
  ],
  { basename: base || '/' }
);
