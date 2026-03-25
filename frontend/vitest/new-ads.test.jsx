import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import NewAd from '../src/components/new-ads.jsx';
import { page, setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('new-ads.jsx', () => {
  it('fetches latest ads and handles carousel actions', async () => {
    const user = userEvent.setup();
    testState.token = 'abc';

    render(<NewAd page={page} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalled();
  });
});
