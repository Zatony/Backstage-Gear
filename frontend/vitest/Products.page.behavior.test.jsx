import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/filter', () => ({
  default: ({ onFilterChange }) => (
    <button onClick={() => onFilterChange({ brandId: '2' })}>ChangeFilter</button>
  ),
}));

vi.mock('../src/components/searchbar', () => ({
  default: ({ onSearch }) => <button onClick={() => onSearch('guitar')}>SearchNow</button>,
}));

vi.mock('../src/components/ads', () => ({
  default: ({ filters }) => <div>Filters:{JSON.stringify(filters)}</div>,
}));

import ProductsPage from '../src/page_products/Products.jsx';

setupCommonBeforeEach();

describe('Products page behavior', () => {
  it('initializes from location state and updates filters from UI actions', async () => {
    const user = userEvent.setup();
    testState.locationState = {
      preselectedFilters: {
        q: 'old',
        categoryIds: [1],
        brandId: 1,
      },
    };

    render(<ProductsPage />);
    expect(screen.getByText(/"q":"old"/)).toBeInTheDocument();

    await user.click(screen.getByText('ChangeFilter'));
    await user.click(screen.getByText('SearchNow'));

    expect(screen.getByText(/"q":"guitar"/)).toBeInTheDocument();
    expect(screen.getByText(/"brandId":"2"/)).toBeInTheDocument();
  });
});
