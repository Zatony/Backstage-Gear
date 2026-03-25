import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/AdFormHeader.jsx', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('../src/components/AdFormFields.jsx', () => ({
  default: ({
    itemNameRef,
    categoryIdRef,
    brandIdRef,
    conditionRef,
    priceRef,
    imageRef,
    descriptionRef,
    categories,
    brands,
  }) => (
    <div>
      <input aria-label='itemName' ref={itemNameRef} defaultValue='' />
      <input aria-label='categoryId' ref={categoryIdRef} defaultValue='' />
      <input aria-label='brandId' ref={brandIdRef} defaultValue='' />
      <input aria-label='condition' ref={conditionRef} defaultValue='' />
      <input aria-label='price' ref={priceRef} defaultValue='' />
      <input aria-label='description' ref={descriptionRef} defaultValue='' />
      <input aria-label='image' type='file' ref={imageRef} />
      <div>categories:{categories.length}</div>
      <div>brands:{brands.length}</div>
    </div>
  ),
}));

vi.mock('../src/components/AdFormActions.jsx', () => ({
  default: ({ submitting, error, buttonText }) => (
    <div>
      {error ? <div>{error}</div> : null}
      <button type='submit' disabled={submitting}>{buttonText}</button>
    </div>
  ),
}));

import NewAdPage from '../src/page_newAd/NewAd.jsx';

setupCommonBeforeEach();

describe('page_newAd/NewAd.jsx', () => {
  it('loads categories and brands', async () => {
    testState.token = 'token';
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/categories')) {
        return Promise.resolve({ ok: true, json: async () => [{ id: 1, name: 'cat' }] });
      }
      if (url.includes('/brands')) {
        return Promise.resolve({ ok: true, json: async () => [{ id: 1, brand_name: 'brand' }] });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<NewAdPage />);

    await waitFor(() => expect(screen.getByText('categories:1')).toBeInTheDocument());
    expect(screen.getByText('brands:1')).toBeInTheDocument();
  });

  it('validates required fields and blocks submit', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/categories') || url.includes('/brands')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<NewAdPage />);
    await user.click(screen.getByRole('button', { name: 'Hirdetés létrehozása' }));

    expect(screen.getByText('Kérjük, tölts ki minden kötelező mezőt!')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining('/me/new_ad'), expect.anything());
  });

  it('submits successfully and navigates to my ads', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/categories') || url.includes('/brands')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      if (url.includes('/me/new_ad')) {
        return Promise.resolve({ ok: true, text: async () => '' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<NewAdPage />);
    fireEvent.change(screen.getByLabelText('itemName'), { target: { value: 'Amp' } });
    fireEvent.change(screen.getByLabelText('categoryId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('brandId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('condition'), { target: { value: 'Used' } });
    fireEvent.change(screen.getByLabelText('price'), { target: { value: '999' } });
    fireEvent.change(screen.getByLabelText('description'), { target: { value: 'Nice amp' } });

    await user.click(screen.getByRole('button', { name: 'Hirdetés létrehozása' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/new_ad'),
        expect.objectContaining({ method: 'POST' }),
      ),
    );
    expect(window.alert).toHaveBeenCalledWith('Hirdetés sikeresen létrehozva!');
    expect(testState.navigate).toHaveBeenCalledWith('/my_ads');
  });

  it('shows API error on submit failure', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/categories') || url.includes('/brands')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      if (url.includes('/me/new_ad')) {
        return Promise.resolve({ ok: false, status: 500, text: async () => 'Server error' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<NewAdPage />);
    fireEvent.change(screen.getByLabelText('itemName'), { target: { value: 'Amp' } });
    fireEvent.change(screen.getByLabelText('categoryId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('brandId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('condition'), { target: { value: 'Used' } });
    fireEvent.change(screen.getByLabelText('price'), { target: { value: '999' } });
    fireEvent.change(screen.getByLabelText('description'), { target: { value: 'Nice amp' } });

    await user.click(screen.getByRole('button', { name: 'Hirdetés létrehozása' }));

    await waitFor(() =>
      expect(screen.getByText('Valami hiba történt: 500: Server error')).toBeInTheDocument(),
    );
  });
});
