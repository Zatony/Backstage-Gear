import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setupCommonBeforeEach, testState } from './testUtils.jsx';
import Routing from '../src/routing.jsx';

setupCommonBeforeEach();

describe('routing.jsx', () => {
  it('builds router config with expected protected routes', () => {
    render(<Routing />);
    expect(screen.getByText('RouterProviderMock')).toBeInTheDocument();

    const rootRoute = testState.lastRouterConfig[0];
    expect(rootRoute.id).toBe('root');
    expect(rootRoute.path).toBe('/');

    const paths = rootRoute.children.map((c) => c.path).filter(Boolean);
    expect(paths).toContain('/my_profile');
    expect(paths).toContain('/message');
    expect(paths).toContain('/reported_ads');
    expect(paths).toContain('/edit_ad');

    const reportedAdsRoute = rootRoute.children.find((c) => c.path === '/reported_ads');
    expect(reportedAdsRoute.loader).toBeDefined();
  });
});
