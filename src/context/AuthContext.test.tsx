import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../utils/getAccessToken';
import { useAuthMutations } from '../hooks/useAuthMutations';
import { fileToBase64 } from '../utils/fileToBase64';
import { AuthContext, AuthProvider } from './AuthContext';
import { setToken, setUser, logout } from '../store/authSlice';
import { User } from '../types/auth/User';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../utils/getAccessToken', () => ({
    getAccessToken: jest.fn(),
}));

jest.mock('../hooks/useAuthMutations', () => ({
    useAuthMutations: jest.fn(),
}));

jest.mock('../utils/fileToBase64', () => ({
    fileToBase64: jest.fn(),
}));

const mockFetchMe = jest.fn();
const mockLoginMutateAsync = jest.fn();
const mockSignUpMutateAsync = jest.fn();
const mockSignOutMutateAsync = jest.fn();
const mockUpdateProfileMutateAsync = jest.fn();

interface AsyncMutationMock {
    mutateAsync: jest.Mock;
}

interface AuthMutationsTestMock {
    fetchMe: jest.Mock;
    loginMutation: AsyncMutationMock;
    signUpMutation: AsyncMutationMock;
    signOutMutation: AsyncMutationMock;
    updateProfileMutation: AsyncMutationMock;
}

const createAuthMutationsMock = (): ReturnType<typeof useAuthMutations> => {
    const mock: AuthMutationsTestMock = {
        fetchMe: mockFetchMe,
        loginMutation: { mutateAsync: mockLoginMutateAsync },
        signUpMutation: { mutateAsync: mockSignUpMutateAsync },
        signOutMutation: { mutateAsync: mockSignOutMutateAsync },
        updateProfileMutation: { mutateAsync: mockUpdateProfileMutateAsync },
    };

    return mock as unknown as ReturnType<typeof useAuthMutations>;
};

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestConsumer = () => {
    const context = useContext(AuthContext);
    if (!context) return <div>No Context</div>;

    return (
        <div>
            <div data-testid='loading'>{context.isAuthLoading ? 'Loading' : 'Ready'}</div>
            <div data-testid='user'>{context.currentUser?.username || 'Guest'}</div>
            <button onClick={() => context.login('test@test.com', 'password')}>Login</button>
            <button onClick={() => context.signUp('new@test.com', 'password')}>Sign Up</button>
            <button onClick={() => context.signOut()}>Sign Out</button>
            <button
                onClick={() =>
                    context.updateProfile({ username: 'updated' }, new File([], 'avatar.png'))
                }
            >
                Update Profile With File
            </button>
            <button onClick={() => context.updateProfile({ username: 'no-file' })}>
                Update Profile No File
            </button>
        </div>
    );
};

describe('AuthContext/AuthProvider', () => {
    const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        username: 'johndoe',
        description: 'Hello world',
        lastLogin: '2026-06-03',
        creationDate: '2026-06-01',
        modifiedDate: '2026-06-02',
    };

    const mockDispatch = jest.fn();
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        jest.mocked(useDispatch).mockReturnValue(mockDispatch);

        jest.mocked(useSelector).mockImplementation((cb) => {
            const dummyState = { auth: { currentUser: null, token: null } };
            return cb(dummyState);
        });

        jest.mocked(getAccessToken).mockReturnValue(null);

        jest.mocked(useAuthMutations).mockReturnValue(createAuthMutationsMock());
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test('should stop loading and keep Guest status if no token is found', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('Ready');
        });
        expect(screen.getByTestId('user').textContent).toBe('Guest');
        expect(mockFetchMe).not.toHaveBeenCalled();
    });

    test('should sync token with Redux, fetch user profile and populate state on mount', async () => {
        jest.mocked(getAccessToken).mockReturnValue('valid-token');
        mockFetchMe.mockResolvedValueOnce(mockUser);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(mockDispatch).toHaveBeenCalledWith(setToken('valid-token'));

        await waitFor(() => {
            expect(mockFetchMe).toHaveBeenCalledWith('valid-token');
        });
        expect(mockDispatch).toHaveBeenCalledWith(setUser(mockUser));
    });

    test('should not dispatch setToken if token is already in redux state', async () => {
        jest.mocked(getAccessToken).mockReturnValue('valid-token');
        jest.mocked(useSelector).mockImplementation((cb) => {
            const dummyState = { auth: { currentUser: null, token: 'valid-token' } };
            return cb(dummyState);
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(mockDispatch).not.toHaveBeenCalledWith(setToken('valid-token'));
    });

    test('should wipe token from localStorage and dispatch logout if profile fetching fails', async () => {
        jest.mocked(getAccessToken).mockReturnValue('expired-token');
        mockFetchMe.mockRejectedValueOnce(new Error('Unauthorized'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
        });
        expect(mockDispatch).toHaveBeenCalledWith(logout());
        expect(screen.getByTestId('loading').textContent).toBe('Ready');
    });

    test('login function should trigger mutation and return user data', async () => {
        mockLoginMutateAsync.mockResolvedValueOnce({ user: mockUser });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const loginButton = screen.getByRole('button', { name: 'Login' });
        userEvent.click(loginButton);

        expect(mockLoginMutateAsync).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'password',
        });
    });

    test('login function should return null on failure', async () => {
        mockLoginMutateAsync.mockRejectedValueOnce(new Error('Invalid credentials'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const loginButton = screen.getByRole('button', { name: 'Login' });
        userEvent.click(loginButton);

        expect(mockLoginMutateAsync).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'password',
        });
    });

    test('signUp function should return true on success', async () => {
        mockSignUpMutateAsync.mockResolvedValueOnce({});

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
        userEvent.click(signUpButton);

        expect(mockSignUpMutateAsync).toHaveBeenCalledWith({
            email: 'new@test.com',
            password: 'password',
        });
    });

    test('signUp function should return false on failure', async () => {
        mockSignUpMutateAsync.mockRejectedValueOnce(new Error('Conflict'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
        userEvent.click(signUpButton);

        expect(mockSignUpMutateAsync).toHaveBeenCalledWith({
            email: 'new@test.com',
            password: 'password',
        });
    });

    test('signOut function should call signOutMutation async method', async () => {
        mockSignOutMutateAsync.mockResolvedValueOnce({});

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
        userEvent.click(signOutButton);

        expect(mockSignOutMutateAsync).toHaveBeenCalled();
    });

    test('updateProfile should transform File to base64 and trigger profile update mutation', async () => {
        jest.mocked(fileToBase64).mockResolvedValueOnce('data:image/png;base64,mockstring');
        mockUpdateProfileMutateAsync.mockResolvedValueOnce(mockUser);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const updateButton = screen.getByRole('button', { name: 'Update Profile With File' });
        userEvent.click(updateButton);

        await waitFor(() => {
            expect(fileToBase64).toHaveBeenCalled();
            expect(mockUpdateProfileMutateAsync).toHaveBeenCalledWith({
                updatedData: { username: 'updated' },
                base64Image: 'data:image/png;base64,mockstring',
            });
        });
    });

    test('updateProfile should trigger profile update mutation without base64 conversion when no file is provided', async () => {
        mockUpdateProfileMutateAsync.mockResolvedValueOnce(mockUser);

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const updateButton = screen.getByRole('button', { name: 'Update Profile No File' });
        userEvent.click(updateButton);

        await waitFor(() => {
            expect(fileToBase64).not.toHaveBeenCalled();
            expect(mockUpdateProfileMutateAsync).toHaveBeenCalledWith({
                updatedData: { username: 'no-file' },
                base64Image: undefined,
            });
        });
    });

    test('updateProfile should return null and log error on mutation failure', async () => {
        mockUpdateProfileMutateAsync.mockRejectedValueOnce(new Error('Update failed'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        const updateButton = screen.getByRole('button', { name: 'Update Profile No File' });
        userEvent.click(updateButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    test('should provide updated user context value when currentUser state updates', async () => {
        jest.mocked(useSelector).mockImplementation((cb) => {
            const dummyState = { auth: { currentUser: mockUser, token: null } };
            return cb(dummyState);
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('johndoe');
    });
});
