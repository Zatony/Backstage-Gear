import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Filter from '../src/components/filter.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('filter.jsx', () => {
  it('loads filter data and emits changes', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<Filter page={page} onFilterChange={onFilterChange} initialFilters={{}} />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await user.click(screen.getByRole('checkbox', { name: 'Guitar' }));
    expect(onFilterChange).toHaveBeenCalled();
  });
});
