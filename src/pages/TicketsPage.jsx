import { listTicketsByUser } from '../api/tickets.js';
import TicketCard from '../components/tickets/TicketCard.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StateMessage from '../components/ui/StateMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { Link } from 'react-router';

export default function TicketsPage() {
  const { session } = useAuth();
  const { status, data: tickets, error } = useAsync(() => listTicketsByUser(session.id), [session.id]);

  return (
    <div>
      <PageHeader eyebrow="Mi cuenta" title="Mis boletos" description="Presenta el código QR en el acceso al evento." />
      {status === 'loading' && <StateMessage title="Cargando boletos..." />}
      {status === 'error' && <StateMessage tone="error" title="No se pudieron cargar los boletos">{error}</StateMessage>}
      {status === 'success' && tickets.length === 0 && (
        <StateMessage title="Todavía no tienes boletos" action={<Button as={Link} to="/eventos">Ver eventos</Button>} />
      )}
      {status === 'success' && tickets.length > 0 && (
        <div className="ticket-list">
          {tickets.map((ticket) => <TicketCard ticket={ticket} key={ticket.id} />)}
        </div>
      )}
    </div>
  );
}
