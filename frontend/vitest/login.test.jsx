import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Login from '../src/components/login.jsx';
import { setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('login.jsx', () => {
  it('validates and submits login flow', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onShowRegister = vi.fn();

    render(<Login onClose={onClose} onShowRegister={onShowRegister} />);

    await user.type(screen.getByLabelText(/E-mail/i), 'a@b.com');
    await user.type(screen.getByLabelText(/Jelszo|Jelszó/i), 'secret');
    await user.click(screen.getByRole('button', { name: /Belep|Belép/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), expect.any(Object)),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
