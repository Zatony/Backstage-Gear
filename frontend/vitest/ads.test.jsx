import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Ads from '../src/components/ads.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ads.jsx', () => {
  it('fetches ad list with filters', async () => {
    render(<Ads page={page} filters={{ q: 'amp', minPrice: '10' }} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
});
