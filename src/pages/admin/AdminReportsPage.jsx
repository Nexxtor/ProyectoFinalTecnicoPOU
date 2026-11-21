import { useState } from 'react';
import { listEvents } from '../../api/events.js';
import { getReport } from '../../api/reports.js';
import BarChart from '../../components/admin/BarChart.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { formatCurrency } from '../../utils/format.js';

export default function AdminReportsPage() {
  const events = useAsync(() => listEvents({ includeDrafts: true }), []);
  const [filters, setFilters] = useState({ from: '', to: '', eventId: '' });
  const report = useAsync(() => getReport(filters), [filters.from, filters.to, filters.eventId]);

  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div>
      <PageHeader eyebrow="Analítica" title="Reportes" description="Ventas por evento y periodo. Solo se incluyen órdenes pagadas." />
      <div className="filters filters--three">
        <FormField label="Desde" htmlFor="report-from">
          <input id="report-from" type="date" value={filters.from} onChange={(event) => update('from', event.target.value)} />
        </FormField>
        <FormField label="Hasta" htmlFor="report-to">
          <input id="report-to" type="date" value={filters.to} onChange={(event) => update('to', event.target.value)} />
        </FormField>
        <FormField label="Evento" htmlFor="report-event">
          <select id="report-event" value={filters.eventId} onChange={(event) => update('eventId', event.target.value)}>
            <option value="">Todos</option>
            {(events.data || []).map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </FormField>
      </div>

      {report.status === 'loading' && <StateMessage title="Calculando reportes..." />}
      {report.status === 'error' && <StateMessage tone="error" title="No se pudo calcular el reporte">{report.error}</StateMessage>}
      {report.status === 'success' && (
        <>
          <div className="stats-grid">
            <StatCard label="Ingresos" value={formatCurrency(report.data.revenue)} />
            <StatCard label="Órdenes" value={report.data.orders} />
            <StatCard label="Boletos" value={report.data.tickets} />
            <StatCard label="Ticket promedio" value={formatCurrency(report.data.averageTicket)} />
          </div>
          <section className="section">
            <h2>Ingresos por evento</h2>
            <BarChart data={report.data.byEvent} />
          </section>
          <section className="section">
            <h2>Detalle</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Evento</th><th>Órdenes</th><th>Boletos</th><th>Ingresos</th></tr></thead>
                <tbody>
                  {report.data.byEvent.map((item) => (
                    <tr key={item.eventId}>
                      <td>{item.title}</td>
                      <td>{item.orders}</td>
                      <td>{item.tickets}</td>
                      <td>{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
