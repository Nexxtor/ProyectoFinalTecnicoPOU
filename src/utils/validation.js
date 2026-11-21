export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'El correo es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'El correo no tiene un formato válido.';
  if (!password) errors.password = 'La contraseña es obligatoria.';
  return errors;
}

export function validatePayment({ holder, cardNumber, expiry, cvv }) {
  const errors = {};
  if (!holder.trim()) errors.holder = 'El nombre del titular es obligatorio.';
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(digits)) errors.cardNumber = 'La tarjeta debe tener 16 dígitos.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errors.expiry = 'Usa el formato MM/AA.';
  if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'El CVV debe tener 3 o 4 dígitos.';
  return errors;
}

export function validateEvent({ title, category, date, time, venue, city }) {
  const errors = {};
  if (!title.trim()) errors.title = 'El título es obligatorio.';
  if (!category.trim()) errors.category = 'La categoría es obligatoria.';
  if (!date) errors.date = 'La fecha es obligatoria.';
  if (!time) errors.time = 'La hora es obligatoria.';
  if (!venue.trim()) errors.venue = 'El lugar es obligatorio.';
  if (!city.trim()) errors.city = 'La ciudad es obligatoria.';
  return errors;
}
