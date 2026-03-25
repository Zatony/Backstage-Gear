import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PasswordChange from '../src/components/passwordChange.jsx';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('passwordChange.jsx', () => {
  it('submits password change with valid values', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    testState.token = 'abc';

    render(<PasswordChange onClose={onClose} />);

    const fields = screen.getAllByLabelText(/jelszo|jelszó/i);
    await user.type(fields[0], 'old');
    await user.type(fields[1], 'new1');
    await user.type(fields[2], 'new1');
    await user.click(screen.getByRole('button', { name: /Modos|Módos/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/update_password'), expect.any(Object)),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
