import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/ItemImageAndUser.jsx', () => ({
  default: ({ onUpVote, onDownVote }) => (
    <div>
      <button onClick={onUpVote}>UpVote</button>
      <button onClick={onDownVote}>DownVote</button>
    </div>
  ),
}));

vi.mock('../src/components/ItemDetails.jsx', () => ({
  default: ({ ad }) => <div>ItemDetails:{ad?.item_name || 'none'}</div>,
}));

vi.mock('../src/components/viewAdButtons.jsx', () => ({
  default: ({ onToggleCart, onReport, onDelete, onEdit, onMessage }) => (
    <div>
      <button onClick={onToggleCart}>ToggleCart</button>
      <button onClick={onReport}>ReportAd</button>
      <button onClick={() => onDelete(1)}>DeleteAd</button>
      <button onClick={() => onEdit(1)}>EditAd</button>
      <button onClick={() => onMessage(2, 'owner', 'Amp')}>MessageSeller</button>
    </div>
  ),
}));

import ViewAdPage from '../src/page_ViewAd/viewAd.jsx';

setupCommonBeforeEach();

describe('page_ViewAd/viewAd.jsx', () => {
  it('alerts for vote and cart actions when logged out', async () => {
    const user = userEvent.setup();
    testState.token = null;
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/ads/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, user_id: 2, item_name: 'Amp' }],
        });
      }
      if (url.includes('/profiles/2')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ profile_id: 9, username: 'owner' }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    render(<ViewAdPage />);
    await waitFor(() => expect(screen.getByText('ItemDetails:Amp')).toBeInTheDocument());

    await user.click(screen.getByText('UpVote'));
    await user.click(screen.getByText('ToggleCart'));
    await user.click(screen.getByText('MessageSeller'));

    expect(window.alert).toHaveBeenCalledTimes(3);
  });

  it('handles success and failure branches for report/vote/delete/edit/message', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    testState.authUserId = 7;

    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/me/ads/1')) {
        return Promise.resolve({ ok: false, json: async () => ({}) });
      }
      if (url.includes('/me/my_ads/1')) {
        return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      if (url.includes('/ads/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, user_id: 2, item_name: 'Amp' }],
        });
      }
      if (url.includes('/profiles/2')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ profile_id: 9, username: 'owner', up_votes: 2, down_votes: 1 }),
        });
      }
      if (url.includes('/me/cart')) {
        if (init?.method === 'GET') return Promise.resolve({ ok: true, json: async () => [] });
        if (init?.method === 'POST') return Promise.resolve({ ok: true, json: async () => ({}) });
      }
      if (url.includes('/me/profiles/9')) {
        return Promise.resolve({ ok: true, text: async () => '' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<ViewAdPage />);
    await waitFor(() => expect(screen.getByText('ItemDetails:Amp')).toBeInTheDocument());

    await user.click(screen.getByText('UpVote'));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/profiles/9'),
        expect.objectContaining({ method: 'PATCH' }),
      ),
    );

    await user.click(screen.getByText('ToggleCart'));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/cart/ads/1'),
        expect.objectContaining({ method: 'POST' }),
      ),
    );

    await user.click(screen.getByText('ReportAd'));
    expect(window.alert).toHaveBeenCalledWith('Hiba történt a hirdetés jelentése során.');

    window.confirm = vi.fn(() => true);
    await user.click(screen.getByText('DeleteAd'));
    expect(testState.navigate).toHaveBeenCalledWith('/my_ads');

    await user.click(screen.getByText('EditAd'));
    expect(testState.navigate).toHaveBeenCalledWith('/edit_ad?id=1');

    await user.click(screen.getByText('MessageSeller'));
    expect(testState.navigate).toHaveBeenCalledWith('/message', {
      state: { recipientId: 2, recipientName: 'owner', adTitle: 'Amp' },
    });
  });
});
