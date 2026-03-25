import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Registration from '../src/components/registration.jsx';
import { setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('registration.jsx', () => {
  it('submits registration form', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Registration onClose={onClose} onRegister={vi.fn()} />);

    const fields = screen.getAllByRole('textbox');
    await user.type(fields[0], 'John Doe');
    await user.type(fields[1], 'john');
    await user.type(fields[2], 'john@example.com');

    const passInputs = screen.getAllByLabelText(/jelszo|jelszó/i);
    await user.type(passInputs[0], 'secret');
    await user.type(passInputs[1], 'secret');

    await user.type(screen.getByLabelText(/Telefon|Telefonszam|Telefonszám/i), '+36 20 123 4567');
    await user.type(screen.getByLabelText(/Szuletesi|Születési/i), '2000-01-01');

    await user.click(screen.getByRole('button', { name: /Regisztracio|Regisztráció/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/signup'), expect.any(Object)),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
