import { render, screen } from '@testing-library/react';
import { type ComponentType, type ReactNode } from 'react';
import App from './App';
import { useAuth } from './hooks/useAuth';

jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        lazy: (importFn: () => Promise<{ default: ComponentType }>) => {
            const fnString = importFn.toString();
            const match = fnString.match(/\/pages\/([A-Za-z0-9_-]+)/);
            const pageName = match ? match[1].toLowerCase() : 'lazy-page';

            return function MockLazyComponent() {
                return <div data-testid={`page-${pageName}`} />;
            };
        },
    };
});

jest.mock(
    'react-router-dom',
    () => ({
        __esModule: true,
        Routes: ({ children }: { children: ReactNode }) => (
            <div data-testid='mock-routes'>{children}</div>
        ),
        Route: ({ path, element }: { path: string; element: ReactNode }) => (
            <div data-testid={`mock-route-${path === '/' ? 'root' : path.replace('/', '')}`}>
                {element}
            </div>
        ),
    }),
    { virtual: true }
);

jest.mock('./hooks/useAuth', () => ({
    __esModule: true,
    useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    __esModule: true,
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('./components/Notification/Notification', () => ({
    __esModule: true,
    default: function MockNotification() {
        return <div data-testid='mock-notification' />;
    },
}));

jest.mock('./components/UI/Loader/Loader', () => ({
    __esModule: true,
    Loader: function MockLoader({ label }: { label: string }) {
        return <div data-testid='mock-loader' data-label={label} />;
    },
}));

jest.mock('./components/Routes/ProtectedRoute', () => ({
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
        <div data-testid='protected-wrapper'>{children}</div>
    ),
}));

jest.mock('./components/Routes/PublicRoute', () => ({
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
        <div data-testid='public-wrapper'>{children}</div>
    ),
}));

describe('App Component Structural Map', () => {
    const setMockLoadingState = (isLoading: boolean) => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthLoading: isLoading });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays fullscreen initialization block while checking active authorization status', () => {
        setMockLoadingState(true);
        render(<App />);

        const loader = screen.getByTestId('mock-loader');
        expect(loader).not.toBeNull();
        expect(loader.getAttribute('data-label')).toBe('app.loading');

        expect(screen.queryByTestId('mock-routes')).toBeNull();
        expect(screen.queryByTestId('mock-notification')).toBeNull();
    });

    test('mounts notification center and structural routing system once initialization completes', () => {
        setMockLoadingState(false);
        render(<App />);

        expect(screen.queryByTestId('mock-loader')).toBeNull();
        expect(screen.getByTestId('mock-notification')).not.toBeNull();
        expect(screen.getByTestId('mock-routes')).not.toBeNull();
    });

    test('protects private dashboard nodes via strict authentication wrappers', () => {
        setMockLoadingState(false);
        render(<App />);

        const rootRoute = screen.getByTestId('mock-route-root');
        expect(rootRoute).not.toBeNull();
        expect(rootRoute.querySelector('[data-testid="protected-wrapper"]')).not.toBeNull();

        const archivedRoute = screen.getByTestId('mock-route-archived');
        expect(archivedRoute).not.toBeNull();
        expect(archivedRoute.querySelector('[data-testid="protected-wrapper"]')).not.toBeNull();
    });

    test('isolates authentication entry points using anonymous guest-only filters', () => {
        setMockLoadingState(false);
        render(<App />);

        const signInRoute = screen.getByTestId('mock-route-signin');
        expect(signInRoute).not.toBeNull();
        expect(signInRoute.querySelector('[data-testid="public-wrapper"]')).not.toBeNull();
    });
});
