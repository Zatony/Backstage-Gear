import { describe, expect, it } from 'vitest';
import HomePage from '../src/page_home/Home.jsx';

describe('page_home/Home.jsx', () => {
  it('exports a page component', () => {
    expect(HomePage).toBeDefined();
  });
});
