import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

globalThis.__BG_TEST_STATE__ = globalThis.__BG_TEST_STATE__ || {
	token: null,
	tokenDuration: 1000,
	authUserId: null,
	routeToken: null,
	loaderData: null,
	locationState: null,
	searchParams: new URLSearchParams('id=1'),
	navigate: vi.fn(),
	submit: vi.fn(),
	revalidate: vi.fn(),
	lastRouterConfig: null,
	lastRouterProviderProps: null,
};

vi.mock('../src/util/auth', () => ({
	getAuthToken: () => globalThis.__BG_TEST_STATE__.token,
	getTokenDuration: () => globalThis.__BG_TEST_STATE__.tokenDuration,
	getAuthUserId: () => globalThis.__BG_TEST_STATE__.authUserId,
	tokenLoader: () => globalThis.__BG_TEST_STATE__.token,
	checkAuthLoader: () => (globalThis.__BG_TEST_STATE__.token ? null : { redirectedTo: '/' }),
	checkEditAdAccess: async () => null,
	checkAdminAccess: async () => null,
}));

vi.mock('react-router-dom', () => ({
	Link: ({ to, children, onClick, ...props }) =>
		React.createElement(
			'a',
			{
				href: to,
				...props,
				onClick: (e) => {
					e.preventDefault();
					if (onClick) onClick(e);
				},
			},
			children,
		),
	Form: ({ children, ...props }) => React.createElement('form', props, children),
	Outlet: () => React.createElement('div', {}, 'OutletMock'),
	useNavigate: () => globalThis.__BG_TEST_STATE__.navigate,
	useRouteLoaderData: () => globalThis.__BG_TEST_STATE__.routeToken,
	useLoaderData: () => globalThis.__BG_TEST_STATE__.loaderData,
	useSubmit: () => globalThis.__BG_TEST_STATE__.submit,
	useRevalidator: () => ({ revalidate: globalThis.__BG_TEST_STATE__.revalidate }),
	useLocation: () => ({ state: globalThis.__BG_TEST_STATE__.locationState }),
	useSearchParams: () => [globalThis.__BG_TEST_STATE__.searchParams],
	createBrowserRouter: (config) => {
		globalThis.__BG_TEST_STATE__.lastRouterConfig = config;
		return { __router: 'mock-router', config };
	},
	RouterProvider: (props) => {
		globalThis.__BG_TEST_STATE__.lastRouterProviderProps = props;
		return React.createElement('div', {}, 'RouterProviderMock');
	},
	redirect: (path) => ({ redirectedTo: path }),
}));
