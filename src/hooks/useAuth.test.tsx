import { renderHook } from '@testing-library/react';
import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthContextParts } from '../types/context/AuthContextParts';
import { useAuth } from './useAuth';

describe('useAuth hook', () => {
    test('should throw an error when used outside of an AuthProvider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useAuth())).toThrow(
            'useAuth must be used within an AuthProvider'
        );

        consoleSpy.mockRestore();
    });

    test('should return context value when used within an AuthProvider', () => {
        const mockAuthContextValue: AuthContextParts = {
            currentUser: {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                description: 'Test user',
                lastLogin: '2026-06-03',
                creationDate: '2026-06-01',
                modifiedDate: '2026-06-02',
            },
            isAuthLoading: false,
            login: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            updateProfile: jest.fn(),
        };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={mockAuthContextValue}>{children}</AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current).toEqual(mockAuthContextValue);
    });
});
