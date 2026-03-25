import { beforeEach, describe, expect, it, vi } from 'vitest';

function makeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe('auth util (real module)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    window.alert = vi.fn();
  });

  it('returns null and clears storage for invalid token', async () => {
    localStorage.setItem('token', 'invalid');
    localStorage.setItem('expiration', new Date(Date.now() + 10000).toISOString());

    const auth = await vi.importActual('../src/util/auth.jsx');
    expect(auth.getAuthToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('returns token for valid non-expired token and user id', async () => {
    const token = makeJwt({ id: 42, username: 'john' });
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', new Date(Date.now() + 60000).toISOString());

    const auth = await vi.importActual('../src/util/auth.jsx');
    expect(auth.getAuthToken()).toBe(token);
    expect(auth.getAuthUserId()).toBe(42);
  });

  it('checkAuthLoader redirects without token', async () => {
    const auth = await vi.importActual('../src/util/auth.jsx');
    expect(auth.checkAuthLoader()).toEqual({ redirectedTo: '/' });
  });

  it('checkEditAdAccess redirects for unauthorized ad owner', async () => {
    const token = makeJwt({ id: 99 });
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', new Date(Date.now() + 60000).toISOString());
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => [{ user_id: 1 }] }));

    const auth = await vi.importActual('../src/util/auth.jsx');
    const result = await auth.checkEditAdAccess({ request: { url: 'http://localhost/edit_ad?id=1' } });

    expect(window.alert).toHaveBeenCalled();
    expect(result).toEqual({ redirectedTo: '/' });
  });
});
