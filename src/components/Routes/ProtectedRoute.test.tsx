import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
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

describe('ProtectedRoute Component', () => {
    test('correctly configures AuthRoute wrapper props and passes child content down', () => {
        render(
            <ProtectedRoute>
                <div data-testid='secret-child'>Secret Page Contents</div>
            </ProtectedRoute>
        );

        const authRouteWrapper = screen.getByTestId('mock-auth-route');
        expect(authRouteWrapper).not.toBeNull();

        expect(authRouteWrapper.getAttribute('data-require-auth')).toBe('true');

        expect(authRouteWrapper.getAttribute('data-redirect-to')).toBe('/noauth');

        expect(screen.getByTestId('secret-child')).not.toBeNull();
        expect(screen.getByText('Secret Page Contents')).not.toBeNull();
    });
});
