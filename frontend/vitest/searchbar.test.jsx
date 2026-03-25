import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../src/components/searchbar.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('searchbar.jsx', () => {
  it('calls search and filter handlers', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onFilter = vi.fn();

    render(<SearchBar page={page} onFilter={onFilter} onSearch={onSearch} initialQuery='' />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'amp');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('amp');

    await user.click(screen.getAllByRole('img')[0]);
    expect(onFilter).toHaveBeenCalled();
  });
});
