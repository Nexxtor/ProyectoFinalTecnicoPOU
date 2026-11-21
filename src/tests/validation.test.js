import { describe, expect, it } from 'vitest';
import { validateEvent, validateLogin, validatePayment } from '../utils/validation.js';

describe('validaciones', () => {
  it('valida el formulario de acceso', () => {
    expect(validateLogin({ email: 'no-es-correo', password: '' })).toEqual({
      email: 'El correo no tiene un formato válido.',
      password: 'La contraseña es obligatoria.'
    });
    expect(validateLogin({ email: 'a@b.com', password: 'secreto' })).toEqual({});
  });

  it('valida los datos de pago', () => {
    const errors = validatePayment({
      holder: '',
      cardNumber: '123',
      expiry: '2028-01',
      cvv: '1'
    });
    expect(errors.holder).toBeTruthy();
    expect(errors.cardNumber).toBeTruthy();
    expect(errors.expiry).toBeTruthy();
    expect(errors.cvv).toBeTruthy();
    expect(
      validatePayment({
        holder: 'Ana',
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/28',
        cvv: '123'
      })
    ).toEqual({});
  });

  it('valida los campos obligatorios de un evento', () => {
    const errors = validateEvent({
      title: '',
      category: '',
      date: '',
      time: '',
      venue: '',
      city: ''
    });
    expect(Object.keys(errors)).toHaveLength(6);
  });
});
