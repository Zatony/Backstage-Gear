import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ReportedAd from '../src/components/reportedAd.jsx';
import { page, setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('reportedAd.jsx', () => {
  it('loads report and runs moderation action', async () => {
    const user = userEvent.setup();
    testState.token = 'abc';

    render(<ReportedAd adId={10} page={page} />);

    await waitFor(() => expect(screen.getByText('Item')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /Hirdetes|Hirdetés/i }));
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/reported_ads/10'), expect.any(Object)),
    );
  });
});
