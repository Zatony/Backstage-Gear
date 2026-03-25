import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/navbar', () => ({
  default: ({ callLogin, showLogin, handleShowRegister }) => (
    <div>
      <button onClick={callLogin}>OpenLogin</button>
      <button onClick={handleShowRegister}>OpenRegister</button>
      <div>ShowLogin:{String(showLogin)}</div>
    </div>
  ),
}));

import Root from '../src/Root.jsx';

setupCommonBeforeEach();

describe('Root.jsx', () => {
  it('submits logout when token duration is expired', () => {
    testState.loaderData = 'token';
    testState.tokenDuration = 0;
    render(<Root />);
    expect(testState.submit).toHaveBeenCalledWith(null, { action: '/logout', method: 'post' });
  });

  it('revalidates on authChanged and handles login modal state', async () => {
    const user = userEvent.setup();
    testState.loaderData = null;
    render(<Root />);

    expect(screen.getByText('OutletMock')).toBeInTheDocument();
    await user.click(screen.getByText('OpenLogin'));
    expect(screen.getByText('ShowLogin:true')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('authChanged'));
    });

    await waitFor(() => expect(testState.revalidate).toHaveBeenCalled());
  });
});
