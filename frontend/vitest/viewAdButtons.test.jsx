import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ItemActions from '../src/components/viewAdButtons.jsx';

const page = {
  priceButtonsFullWidth: 'priceButtonsFullWidth',
  price: 'price',
  buttonRow: 'buttonRow',
  myAd: 'myAd',
  inCart: 'inCart',
  notInCart: 'notInCart',
  reportBtn: 'reportBtn',
  reachOutBtn: 'reachOutBtn',
};

function renderItemActions(overrides = {}) {
  const defaultProps = {
    page,
    ad: { id: 10, price: 12000, user_id: 2, item_name: 'Guitar' },
    userData: { username: 'anna' },
    isMyAd: false,
    inCart: false,
    loading: false,
    onToggleCart: vi.fn(),
    onReport: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onMessage: vi.fn(),
  };

  const props = { ...defaultProps, ...overrides };
  render(<ItemActions {...props} />);
  return props;
}

describe('ItemActions', () => {
  it('calls onToggleCart for non-owner ad', async () => {
    const user = userEvent.setup();
    const props = renderItemActions({ isMyAd: false, inCart: false });

    await user.click(
      screen.getByRole('button', { name: 'Kívánságlistára tűzés' }),
    );

    expect(props.onToggleCart).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit with ad id for owner ad', async () => {
    const user = userEvent.setup();
    const props = renderItemActions({ isMyAd: true });

    await user.click(screen.getByRole('button', { name: 'Módosítás' }));

    expect(props.onEdit).toHaveBeenCalledWith(10);
    expect(props.onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onMessage with expected arguments', async () => {
    const user = userEvent.setup();
    const props = renderItemActions({
      isMyAd: false,
      ad: { id: 10, price: 12000, user_id: 7, item_name: 'Fender Bass' },
      userData: { username: 'bela' },
    });

    await user.click(screen.getByRole('button', { name: 'Érdeklődés' }));

    expect(props.onMessage).toHaveBeenCalledWith(7, 'bela', 'Fender Bass');
    expect(props.onMessage).toHaveBeenCalledTimes(1);
  });
});
