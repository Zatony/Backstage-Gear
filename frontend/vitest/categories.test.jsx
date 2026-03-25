import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Categories from '../src/components/categories.jsx';
import { page, setupCommonBeforeEach } from './testUtils.jsx';

setupCommonBeforeEach();

describe('categories.jsx', () => {
  it('loads categories on mount', async () => {
    render(<Categories page={page} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/categories'));
  });
});
