import { describe, expect, it } from 'vitest';
import AboutPage from '../src/page_about/about.jsx';

describe('page_about/about.jsx', () => {
  it('exports a page component', () => {
    expect(AboutPage).toBeDefined();
  });
});
