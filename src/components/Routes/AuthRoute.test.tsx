import { render, screen } from '@testing-library/react';
import AuthRoute from './AuthRoute';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/auth/User';
import { AuthRouteProps } from '../../types/props/AuthRouteProps';

jest.mock(
    'react-router-dom',
    () => ({
        Navigate: function MockNavigate({ to, replace }: { to: string; replace?: boolean }) {
            return (
                <div
                    data-testid='mock-navigate'
                    data-to={to}
                    data-replace={replace ? 'true' : 'false'}
                />
            );
        },
    }),
    { virtual: true }
);

jest.mock('../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

describe('AuthRoute Component', () => {
    const mockAuthenticatedUser: User = {
        id: 123,
        username: 'testuser',
        email: 'test@example.com',
        description: 'Test user',
        lastLogin: '2026-06-03',
        creationDate: '2026-06-01',
        modifiedDate: '2026-06-02',
    };

    const defaultProps: AuthRouteProps = {
        requireAuth: true,
        redirectTo: '/login',
        children: <div data-testid='protected-content'>Protected Content</div>,
    };

    const setMockUser = (user: User | null) => {
        (useAuth as jest.Mock).mockReturnValue({ currentUser: user });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects to target path when authentication is required but user is anonymous', () => {
        setMockUser(null);
        render(<AuthRoute {...defaultProps} />);

        expect(screen.queryByTestId('protected-content')).toBeNull();

        const navigate = screen.getByTestId('mock-navigate');
        expect(navigate.getAttribute('data-to')).toBe('/login');
        expect(navigate.getAttribute('data-replace')).toBe('true');
    });

    test('renders protected child layout when authentication is required and user details exist', () => {
        setMockUser(mockAuthenticatedUser);
        render(<AuthRoute {...defaultProps} />);

        expect(screen.getByTestId('protected-content')).not.toBeNull();
        expect(screen.queryByTestId('mock-navigate')).toBeNull();
    });

    test('redirects to safe route when page is guest-only but an authenticated user attempts access', () => {
        setMockUser(mockAuthenticatedUser);
        render(
            <AuthRoute requireAuth={false} redirectTo='/dashboard'>
                <div data-testid='guest-content'>Guest Content</div>
            </AuthRoute>
        );

        expect(screen.queryByTestId('guest-content')).toBeNull();

        const navigate = screen.getByTestId('mock-navigate');
        expect(navigate.getAttribute('data-to')).toBe('/dashboard');
        expect(navigate.getAttribute('data-replace')).toBe('true');
    });

    test('renders component contents normally when page is guest-only and user remains anonymous', () => {
        setMockUser(null);
        render(
            <AuthRoute requireAuth={false} redirectTo='/dashboard'>
                <div data-testid='guest-content'>Guest Content</div>
            </AuthRoute>
        );

        expect(screen.getByTestId('guest-content')).not.toBeNull();
        expect(screen.queryByTestId('mock-navigate')).toBeNull();
    });
});
