import { describe, expect, it } from 'vitest';
import MyAdsPage from '../src/page_myAds/MyAds.jsx';

describe('page_myAds/MyAds.jsx', () => {
  it('exports a page component', () => {
    expect(MyAdsPage).toBeDefined();
  });
});
