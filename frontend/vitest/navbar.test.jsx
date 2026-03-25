import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NavBar from '../src/components/navbar.jsx';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

setupCommonBeforeEach();

describe('navbar.jsx', () => {
  it('calls login handler and blocks cart open when logged out', async () => {
    const user = userEvent.setup();
    const callLogin = vi.fn();

    render(
      <NavBar
        callLogin={callLogin}
        showLogin={false}
        handleCloseLogin={vi.fn()}
        showRegister={false}
        handleCloseRegister={vi.fn()}
        handleShowRegister={vi.fn()}
        handleShowLogin={vi.fn()}
      />,
    );

    await user.click(screen.getByAltText('User'));
    expect(callLogin).toHaveBeenCalled();

    await user.click(screen.getByAltText('Cart'));
    expect(window.alert).toHaveBeenCalled();
  });

  it('loads profile and cart, opens dropdown and navigates cart', async () => {
    const user = userEvent.setup();
    testState.routeToken = 'route-token';
    testState.token = 'route-token';

    render(
      <NavBar
        callLogin={vi.fn()}
        showLogin={false}
        handleCloseLogin={vi.fn()}
        showRegister={false}
        handleCloseRegister={vi.fn()}
        handleShowRegister={vi.fn()}
        handleShowLogin={vi.fn()}
      />,
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('1')).toBeInTheDocument();

    await user.click(screen.getByAltText('User'));
    expect(screen.getByText('Profil')).toBeInTheDocument();

    await user.click(screen.getByAltText('Cart'));
    expect(testState.navigate).toHaveBeenCalledWith('/cart');
  });

  it('updates token on authChanged event', async () => {
    const user = userEvent.setup();
    testState.routeToken = 'route-token';
    testState.token = 'route-token';

    render(
      <NavBar
        callLogin={vi.fn()}
        showLogin={false}
        handleCloseLogin={vi.fn()}
        showRegister={false}
        handleCloseRegister={vi.fn()}
        handleShowRegister={vi.fn()}
        handleShowLogin={vi.fn()}
      />,
    );

    await user.click(screen.getByAltText('User'));
    expect(screen.getByText('Profil')).toBeInTheDocument();

    testState.token = null;
    act(() => {
      window.dispatchEvent(new Event('authChanged'));
    });

    await waitFor(() => expect(screen.queryByText('Profil')).not.toBeInTheDocument());
  });

  it('handles profile fetch errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    testState.routeToken = 'route-token';
    testState.token = 'route-token';
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/my_profile')) return Promise.reject(new Error('profile failed'));
      if (url.includes('/me/cart')) {
        return Promise.resolve({ ok: false, json: async () => [] });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(
      <NavBar
        callLogin={vi.fn()}
        showLogin={false}
        handleCloseLogin={vi.fn()}
        showRegister={false}
        handleCloseRegister={vi.fn()}
        handleShowRegister={vi.fn()}
        handleShowLogin={vi.fn()}
      />,
    );

    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    errorSpy.mockRestore();
  });
});
