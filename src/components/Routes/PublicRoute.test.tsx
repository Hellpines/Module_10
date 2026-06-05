import { render, screen } from '@testing-library/react';
import PublicRoute from './PublicRoute';
import { AuthRouteProps } from '../../types/props/AuthRouteProps';

jest.mock('./AuthRoute', () => {
    return function MockAuthRoute({ children, requireAuth, redirectTo }: AuthRouteProps) {
        return (
            <div
                data-testid='mock-auth-route'
                data-require-auth={String(requireAuth)}
                data-redirect-to={redirectTo}
            >
                {children}
            </div>
        );
    };
});

describe('PublicRoute Component', () => {
    test('correctly configures AuthRoute wrapper props for guest-only access and passes child content down', () => {
        render(
            <PublicRoute>
                <div data-testid='public-child'>Public Page Contents</div>
            </PublicRoute>
        );

        const authRouteWrapper = screen.getByTestId('mock-auth-route');
        expect(authRouteWrapper).not.toBeNull();

        expect(authRouteWrapper.getAttribute('data-require-auth')).toBe('false');

        expect(authRouteWrapper.getAttribute('data-redirect-to')).toBe('/');

        expect(screen.getByTestId('public-child')).not.toBeNull();
        expect(screen.getByText('Public Page Contents')).not.toBeNull();
    });
});
