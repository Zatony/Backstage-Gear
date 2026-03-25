import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';

vi.mock('../src/components/searchbar', () => ({
  default: ({ onFilter, onSearch }) => (
    <div>
      <button onClick={onFilter}>OpenFilter</button>
      <button onClick={() => onSearch('amp')}>DoSearch</button>
    </div>
  ),
}));

vi.mock('../src/components/filter', () => ({
  default: ({ onFilterChange }) => (
    <button onClick={() => onFilterChange({ minPrice: '10' })}>ApplyFilter</button>
  ),
}));

vi.mock('../src/components/categories', () => ({ default: () => <div>CategoriesMock</div> }));
vi.mock('../src/components/new-ads', () => ({ default: () => <div>NewAdsMock</div> }));

import HomePage from '../src/page_home/Home.jsx';

setupCommonBeforeEach();

describe('Home page behavior', () => {
  it('toggles filter and navigates with merged filters and query', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByText('CategoriesMock')).toBeInTheDocument();
    await user.click(screen.getByText('OpenFilter'));
    await user.click(screen.getByText('ApplyFilter'));
    await user.click(screen.getByText('DoSearch'));

    expect(testState.navigate).toHaveBeenCalledWith('/products', {
      state: { preselectedFilters: { minPrice: '10', q: 'amp' } },
    });
  });
});
