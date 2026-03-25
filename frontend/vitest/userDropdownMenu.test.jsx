import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UserDropdownMenu from '../src/components/userDropdownMenu.jsx';
import { setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('userDropdownMenu.jsx', () => {
  it('renders links, loads admin flag and submits logout', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <UserDropdownMenu
        userData={{ username: 'john' }}
        dropdownPos={{ top: 10, right: 10 }}
        logoutIcon='logout.png'
        onClose={onClose}
      />,
    );

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/is_admin'), expect.any(Object)),
    );

    await user.click(screen.getByText('Profil'));
    expect(onClose).toHaveBeenCalled();

    fireEvent.submit(screen.getByRole('button', { name: /Kilep|Kilép/i }).closest('form'));
    expect(onClose).toHaveBeenCalled();
  });
});
