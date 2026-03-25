import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/ad', () => ({
  default: ({ adName }) => <div>AdItem:{adName}</div>,
}));

import ListPage from '../src/page_list/List.jsx';

setupCommonBeforeEach();

describe('List page behavior', () => {
  it('shows empty state without token', async () => {
    testState.token = null;
    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('Üres lista')).toBeInTheDocument());
  });

  it('renders cart items when API returns data', async () => {
    testState.token = 'token';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Amp', description: 'd', files: ['x.png'], price: 100 }],
      }),
    );

    render(<ListPage />);
    await waitFor(() => expect(screen.getByText('AdItem:Amp')).toBeInTheDocument());
  });
});
