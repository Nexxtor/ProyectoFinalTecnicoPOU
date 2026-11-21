import { Link } from 'react-router';
import { listEvents } from '../../api/events.js';
import { listAllOrders } from '../../api/orders.js';
import { getReport } from '../../api/reports.js';
import BarChart from '../../components/admin/BarChart.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { formatCurrency, formatDateTime, statusLabel, statusTone } from '../../utils/format.js';

export default function AdminDashboardPage() {
  const events = useAsync(() => listEvents({ includeDrafts: true }), []);
  const orders = useAsync(() => listAllOrders(), []);
  const report = useAsync(() => getReport(), []);

  const loading = events.status === 'loading' || orders.status === 'loading' || report.status === 'loading';
  const error = events.error || orders.error || report.error;

  if (loading) return <StateMessage title="Cargando dashboard..." />;
  if (error) return <StateMessage tone="error" title="No se pudo cargar el dashboard">{error}</StateMessage>;

  const published = events.data.filter((event) => event.status === 'published').length;
  const recent = orders.data.slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Administración"
        title="Dashboard"
        description="Resumen de ventas, eventos y actividad reciente."
        actions={<Button as={Link} to="/admin/eventos/nuevo">Nuevo evento</Button>}
      />
      <div className="stats-grid">
        <StatCard label="Ingresos" value={formatCurrency(report.data.revenue)} hint="Órdenes pagadas" />
        <StatCard label="Órdenes" value={report.data.orders} hint="Pagadas" />
        <StatCard label="Boletos" value={report.data.tickets} hint="Emitidos" />
        <StatCard label="Eventos publicados" value={published} hint={`${events.data.length} en total`} />
      </div>

      <div className="admin-two-columns">
        <section>
          <h2>Ingresos por evento</h2>
          <BarChart data={report.data.byEvent} />
        </section>
        <section>
          <h2>Accesos rápidos</h2>
          <div className="quick-links">
            <Link to="/admin/eventos">Gestionar eventos</Link>
            <Link to="/admin/inventario">Inventario y precios</Link>
            <Link to="/admin/reportes">Ver reportes</Link>
          </div>
        </section>
      </div>

      <section className="section">
        <h2>Órdenes recientes</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDateTime(order.createdAt)}</td>
                  <td><Badge tone={statusTone(order.status)}>{statusLabel(order.status)}</Badge></td>
                  <td>{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
