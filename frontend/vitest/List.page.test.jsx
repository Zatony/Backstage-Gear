import { describe, expect, it } from 'vitest';
import ListPage from '../src/page_list/List.jsx';

describe('page_list/List.jsx', () => {
  it('exports a page component', () => {
    expect(ListPage).toBeDefined();
  });
});
