import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/ad', () => ({
  default: ({ adName }) => <div>MyAd:{adName}</div>,
}));

import MyAdsPage from '../src/page_myAds/MyAds.jsx';

setupCommonBeforeEach();

describe('MyAds page behavior', () => {
  it('shows empty state when no ads', async () => {
    testState.token = 'token';
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => [] }));

    render(<MyAdsPage />);
    await waitFor(() => expect(screen.getByText('Üres lista')).toBeInTheDocument());
  });

  it('renders fetched ads list', async () => {
    testState.token = 'token';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [{ id: 2, name: 'Bass', description: 'd', files: ['x.png'], price: 200 }],
      }),
    );

    render(<MyAdsPage />);
    await waitFor(() => expect(screen.getByText('MyAd:Bass')).toBeInTheDocument());
  });
});
