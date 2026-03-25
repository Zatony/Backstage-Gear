import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/reportedAd', () => ({
  default: ({ adId }) => <div>ReportedItem:{adId}</div>,
}));

import ReportedAdsPage from '../src/page_reportedAds/ReportedAds.jsx';

setupCommonBeforeEach();

describe('ReportedAds page behavior', () => {
  it('shows empty message when no reports', async () => {
    testState.token = 'token';
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => [] }));

    render(<ReportedAdsPage />);
    await waitFor(() => expect(screen.getByText('Nincsenek jelentett hirdetések.')).toBeInTheDocument());
  });

  it('renders reported ad items', async () => {
    testState.token = 'token';
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => [{ id: 11, name: 'X' }] }));

    render(<ReportedAdsPage />);
    await waitFor(() => expect(screen.getByText('ReportedItem:11')).toBeInTheDocument());
  });
});
