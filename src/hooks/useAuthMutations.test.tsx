import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuthMutations } from './useAuthMutations';
import { graphqlRequest } from '../api/graphqlRequest';
import { setToken, setUser, logout } from '../store/authSlice';
import { User } from '../types/auth/User';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockShowNotifications = jest.fn();
jest.mock('./useNotification', () => ({
    useNotification: () => ({
        showNotifications: mockShowNotifications,
    }),
}));

jest.mock('../api/graphqlRequest', () => ({
    graphqlRequest: jest.fn(),
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuthMutations hook', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;
    const mockToken = 'mock-access-token';

    const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        username: 'johndoe',
        description: 'Hello world',
        lastLogin: '2026-06-03',
        creationDate: '2026-06-01',
        modifiedDate: '2026-06-02',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();

        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    });

    test('fetchMe should call graphqlRequest and return user data', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ me: mockUser });

        const { result } = renderHook(() => useAuthMutations(mockToken), { wrapper });
        const user = await result.current.fetchMe(mockToken);

        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('query GetMe'),
            {},
            mockToken
        );
        expect(user).toEqual(mockUser);
    });

    test('loginMutation should save token to localStorage and dispatch credentials on success', async () => {
        const loginResponse = { login: { token: 'new-token', user: mockUser } };
        (graphqlRequest as jest.Mock).mockResolvedValueOnce(loginResponse);

        const { result } = renderHook(() => useAuthMutations(null), { wrapper });

        result.current.loginMutation.mutate({ email: 'test@test.com', password: 'password123' });

        await waitFor(() => expect(result.current.loginMutation.isSuccess).toBe(true));

        expect(localStorageMock.getItem('access_token')).toBe('new-token');
        expect(mockDispatch).toHaveBeenCalledWith(setToken('new-token'));
        expect(mockDispatch).toHaveBeenCalledWith(setUser(mockUser));
    });

    test('updateProfileMutation should dispatch setUser on success', async () => {
        const updatedUser: User = { ...mockUser, username: 'newusername' };
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ updateProfile: updatedUser });

        const { result } = renderHook(() => useAuthMutations(mockToken), { wrapper });

        result.current.updateProfileMutation.mutate({
            updatedData: { username: 'newusername' },
            base64Image: 'image-data',
        });

        await waitFor(() => expect(result.current.updateProfileMutation.isSuccess).toBe(true));

        expect(mockDispatch).toHaveBeenCalledWith(setUser(updatedUser));
    });

    test('signUpMutation should return success message', async () => {
        const signupResponse = { signup: { message: 'User registered successfully' } };
        (graphqlRequest as jest.Mock).mockResolvedValueOnce(signupResponse);

        const { result } = renderHook(() => useAuthMutations(null), { wrapper });

        result.current.signUpMutation.mutate({ email: 'new@test.com', password: 'password' });

        await waitFor(() => expect(result.current.signUpMutation.isSuccess).toBe(true));
        expect(result.current.signUpMutation.data).toEqual(signupResponse);
    });

    test('signOutMutation should clear token, call notification and dispatch logout', async () => {
        localStorageMock.setItem('access_token', mockToken);
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ logout: { message: 'Logged out' } });

        const { result } = renderHook(() => useAuthMutations(mockToken), { wrapper });

        result.current.signOutMutation.mutate();

        await waitFor(() => expect(result.current.signOutMutation.isSuccess).toBe(true));

        expect(mockShowNotifications).toHaveBeenCalledWith('profile.logoutSuccess', 'success');
        expect(localStorageMock.getItem('access_token')).toBeNull();
        expect(mockDispatch).toHaveBeenCalledWith(logout());
    });
});
