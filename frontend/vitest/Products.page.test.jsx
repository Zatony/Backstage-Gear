import { describe, expect, it } from 'vitest';
import ProductsPage from '../src/page_products/Products.jsx';

describe('page_products/Products.jsx', () => {
  it('exports a page component', () => {
    expect(ProductsPage).toBeDefined();
  });
});
