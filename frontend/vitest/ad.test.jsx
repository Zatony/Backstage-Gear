import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Ad from '../src/components/ad.jsx';
import { page, setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('ad.jsx', () => {
  it('alerts when user is not logged in', async () => {
    const user = userEvent.setup();
    render(<Ad adName='A' adDesc='B' adImg='i.png' adPrice={1000} page={page} adId={1} />);

    await user.click(screen.getByRole('button'));
    expect(window.alert).toHaveBeenCalled();
  });

  it('navigates to product when card is clicked', async () => {
    const user = userEvent.setup();
    render(<Ad adName='A' adDesc='B' adImg='i.png' adPrice={1000} page={page} adId={10} />);

    await user.click(screen.getByText('A'));
    expect(testState.navigate).toHaveBeenCalledWith('/product?id=10');
  });

  it('navigates to edit page for own ad', async () => {
    const user = userEvent.setup();
    testState.token = 'abc';

    render(
      <Ad
        adName='Own ad'
        adDesc='desc'
        adImg='i.png'
        adPrice={1000}
        page={page}
        adId={3}
        myAdIds={[3]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Módosítás' }));
    expect(testState.navigate).toHaveBeenCalledWith('/edit_ad?id=3');
  });

  it('deletes existing cart item and dispatches cartChanged', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    testState.token = 'abc';

    render(
      <Ad
        adName='A'
        adDesc='B'
        adImg='i.png'
        adPrice={1000}
        page={page}
        adId={2}
        cartIds={[2]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Eltávolítás a kívánságlistáról' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/cart/2'),
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('handles cart add API errors without crashing', async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    testState.token = 'abc';
    global.fetch = vi.fn(() => Promise.reject(new Error('network')));

    render(<Ad adName='A' adDesc='B' adImg='i.png' adPrice={1000} page={page} adId={9} />);

    await user.click(screen.getByRole('button', { name: 'Kívánságlistára tűzés' }));

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    errorSpy.mockRestore();
  });
});
