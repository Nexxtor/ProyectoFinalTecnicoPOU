import QRCode from 'react-qr-code';
import { formatDate } from '../../utils/format.js';
import { buildTicketPayload, ticketDisplayCode } from '../../utils/qr.js';

export default function TicketCard({ ticket }) {
  return (
    <article className="ticket">
      <div className="ticket__info">
        <p className="eyebrow">Boleto electrónico</p>
        <h3>{ticket.eventTitle}</h3>
        <p>
          {formatDate(ticket.eventDate)} · {ticket.eventTime}
        </p>
        <p>
          {ticket.venue}, {ticket.city}
        </p>
        <dl className="ticket__data">
          <div>
            <dt>Zona</dt>
            <dd>{ticket.zoneName}</dd>
          </div>
          <div>
            <dt>Titular</dt>
            <dd>{ticket.holderName}</dd>
          </div>
          <div>
            <dt>Código</dt>
            <dd>{ticketDisplayCode(ticket)}</dd>
          </div>
        </dl>
      </div>
      <div className="ticket__qr">
        <QRCode value={buildTicketPayload(ticket)} size={132} />
        <small>Presenta este código en el acceso.</small>
      </div>
    </article>
  );
}
