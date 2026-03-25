import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/AdFormHeader.jsx', () => ({
  default: ({ title }) => <h1>{title}</h1>,
}));

vi.mock('../src/components/AdFormFields.jsx', () => ({
  default: ({ itemNameRef, categoryIdRef, brandIdRef, conditionRef, priceRef, imageRef, descriptionRef }) => (
    <div>
      <input aria-label='itemName' ref={itemNameRef} defaultValue='' />
      <input aria-label='categoryId' ref={categoryIdRef} defaultValue='' />
      <input aria-label='brandId' ref={brandIdRef} defaultValue='' />
      <input aria-label='condition' ref={conditionRef} defaultValue='' />
      <input aria-label='price' ref={priceRef} defaultValue='' />
      <input aria-label='description' ref={descriptionRef} defaultValue='' />
      <input aria-label='image' type='file' ref={imageRef} />
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

import EditAdPage from '../src/page_editAd/EditAd.jsx';

setupCommonBeforeEach();

describe('EditAd page behavior', () => {
  it('validates required fields on submit', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    window.history.pushState({}, '', '/edit_ad?id=7');
    global.fetch = vi.fn((input) => {
      const url = String(input);
      if (url.includes('/categories')) return Promise.resolve({ ok: true, json: async () => [] });
      if (url.includes('/brands')) return Promise.resolve({ ok: true, json: async () => [] });
      if (url.includes('/me/my_ads/7')) return Promise.resolve({ ok: true, json: async () => [{ id: 7 }] });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<EditAdPage />);
    await user.click(screen.getByRole('button', { name: 'Módosítások mentése' }));
    expect(screen.getByText('Kérjük, tölts ki minden kötelező mezőt!')).toBeInTheDocument();
  });

  it('submits edit and navigates on success', async () => {
    const user = userEvent.setup();
    testState.token = 'token';
    window.history.pushState({}, '', '/edit_ad?id=9');
    global.fetch = vi.fn((input, init) => {
      const url = String(input);
      if (url.includes('/categories')) return Promise.resolve({ ok: true, json: async () => [{ id: 1, name: 'cat' }] });
      if (url.includes('/brands')) return Promise.resolve({ ok: true, json: async () => [{ id: 1, brand_name: 'brand' }] });
      if (url.includes('/me/my_ads/9') && !init?.method) {
        return Promise.resolve({ ok: true, json: async () => [{ item_name: 'A', category_name: 'cat', brand_name: 'brand', item_condition: 'használt', price: 12, description: 'd' }] });
      }
      if (url.includes('/update_ad/9')) {
        return Promise.resolve({ ok: true, text: async () => '' });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(<EditAdPage />);

    fireEvent.change(screen.getByLabelText('itemName'), { target: { value: 'Amp' } });
    fireEvent.change(screen.getByLabelText('categoryId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('brandId'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('condition'), { target: { value: 'Used' } });
    fireEvent.change(screen.getByLabelText('price'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('description'), { target: { value: 'desc' } });

    await user.click(screen.getByRole('button', { name: 'Módosítások mentése' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/update_ad/9'),
        expect.objectContaining({ method: 'PATCH' }),
      ),
    );
    expect(testState.navigate).toHaveBeenCalledWith('/my_ads');
  });
});
