import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../context/AuthContext.jsx';
import LoginPage from '../pages/LoginPage.jsx';

describe('LoginPage', () => {
  it('completa las credenciales de demostración', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: /Cliente/ }));
    expect(screen.getByLabelText('Correo')).toHaveValue('cliente@eventos.test');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('cliente123');
  });
});
