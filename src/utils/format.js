export function formatCurrency(value) {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('es-SV', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function statusLabel(status) {
  const labels = {
    published: 'Publicado',
    draft: 'Borrador',
    soldout: 'Agotado',
    finished: 'Finalizado',
    paid: 'Pagada',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    valid: 'Válido'
  };
  return labels[status] || status;
}

export function statusTone(status) {
  const tones = {
    published: 'success',
    draft: 'neutral',
    soldout: 'warning',
    finished: 'neutral',
    paid: 'success',
    pending: 'warning',
    cancelled: 'danger',
    valid: 'success'
  };
  return tones[status] || 'neutral';
}
