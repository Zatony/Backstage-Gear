import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/util/phoneUtils', () => ({
  formatHungarianPhone: (value) => value || '',
  unformatHungarianPhone: (value) => value || '',
  createPhoneChangeHandler: (phoneRef, validate, key) => (e) => {
    validate(e.target.value, key);
  },
}));

vi.mock('../src/components/passwordChange', () => ({
  default: ({ onClose }) => <button onClick={onClose}>ClosePasswordModal</button>,
}));

vi.mock('../src/components/inputField', () => ({
  default: ({ label, type = 'text', defaultValue = '', refInput, onChange, readOnly }) => {
    if (type === 'file') {
      return <input aria-label={label} type='file' ref={refInput} disabled={!readOnly ? false : false} />;
    }
    return (
      <input
        aria-label={label}
        defaultValue={defaultValue}
        ref={refInput}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  },
}));

import ProfilePage from '../src/page_profile/Profile.jsx';

setupCommonBeforeEach();

describe('page_profile/Profile.jsx', () => {
  it('loads profile data and opens/closes password modal', async () => {
    const user = userEvent.setup();
    testState.token = 'token';

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/me/my_profile') && !init?.method) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            username: 'john',
            phone_number: '36201234567',
            profile_picture: 'u.png',
            up_votes: 1,
            down_votes: 2,
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByLabelText('Felhasználónév')).toHaveValue('john'));

    await user.click(screen.getByRole('button', { name: 'Jelszó módosítása' }));
    expect(screen.getByText('ClosePasswordModal')).toBeInTheDocument();
    await user.click(screen.getByText('ClosePasswordModal'));
    expect(screen.queryByText('ClosePasswordModal')).not.toBeInTheDocument();
  });

  it('handles delete profile cancel and success paths', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    testState.token = 'token';

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/me/my_profile') && !init?.method) {
        return Promise.resolve({ ok: true, json: async () => ({ username: 'john' }) });
      }
      if (url.includes('/delete_my_profile')) {
        return Promise.resolve({ ok: true, text: async () => '' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<ProfilePage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    window.confirm = vi.fn(() => false);
    await user.click(screen.getByRole('button', { name: 'Profil törlése' }));
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining('/delete_my_profile'), expect.anything());

    window.confirm = vi.fn(() => true);
    await user.click(screen.getByRole('button', { name: 'Profil törlése' }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/delete_my_profile'),
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );

    expect(window.alert).toHaveBeenCalledWith('Profil sikeresen törölve!');
    expect(dispatchSpy).toHaveBeenCalled();
    expect(testState.navigate).toHaveBeenCalledWith('/');
  });

  it('updates profile and handles update errors', async () => {
    const user = userEvent.setup();
    testState.token = 'token';

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/me/my_profile') && !init?.method) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ username: 'john', phone_number: '36201234567', profile_picture: 'u.png', up_votes: 0, down_votes: 0 }),
        });
      }
      if (url.includes('/update_datas')) {
        return Promise.resolve({ ok: true, text: async () => '' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByLabelText('Felhasználónév')).toHaveValue('john'));

    await user.click(screen.getByRole('button', { name: 'Adatok módosítása' }));
    const usernameInput = screen.getByLabelText('Felhasználónév');
    fireEvent.change(usernameInput, { target: { value: 'john2' } });
    await user.click(screen.getByRole('button', { name: 'Mentés' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/update_datas'),
        expect.objectContaining({ method: 'PATCH' }),
      ),
    );
    expect(window.alert).toHaveBeenCalledWith('Profil sikeresen frissítve!');

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/me/my_profile') && !init?.method) {
        return Promise.resolve({ ok: true, json: async () => ({ username: 'john', profile_picture: 'u.png', phone_number: '36201234567', up_votes: 0, down_votes: 0 }) });
      }
      if (url.includes('/update_datas')) {
        return Promise.resolve({ ok: false, text: async () => 'bad data' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<ProfilePage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await user.click(screen.getAllByRole('button', { name: 'Adatok módosítása' })[1]);
    await user.click(screen.getAllByRole('button', { name: 'Mentés' })[0]);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Hiba történt a frissítés során: bad data'));
  });
});
