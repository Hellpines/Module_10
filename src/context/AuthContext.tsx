import { createContext, useCallback, useEffect, useState } from 'react';
import { users as initialUsers } from '../mocks/usersMock';
import { AuthContextParts } from '../types/AuthContextParts';
import { ProviderProps } from '../types/ProviderProps';
import { User } from '../types/User';

export const AuthContext = createContext<AuthContextParts | null>(null);

export const AuthProvider = ({ children }: ProviderProps) => {
    const [users, setUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem('users');
        if (!savedUsers) {
            return initialUsers
        };

        try {
            return JSON.parse(savedUsers);
        } catch (error) {
            console.error('Error with parsing of users:', error);
            return initialUsers;
        }
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('current-user');
        if (!savedUser) {
            return null
        };

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error('Error with parsing of current user:', error);
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('current-user', JSON.stringify(currentUser));
    }, [currentUser]);

    const signOut = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_at');
    }, []);

    const refreshToken = useCallback(async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
            signOut();
            return null;
        }

        await new Promise((res) => setTimeout(res, 500));

        const newAccess = 'fake-access-' + Math.random();
        const expiresAt = Date.now() + 60 * 1000;

        localStorage.setItem('access_token', newAccess);
        localStorage.setItem('token_expires_at', expiresAt.toString());

        console.log('Token refreshed');
        return newAccess;
    }, [signOut]);

    const requestWithAuth = useCallback(async (action: () => void) => {
        const expiresAt = Number(localStorage.getItem('token_expires_at'));
        if (expiresAt && Date.now() > expiresAt) {
            console.warn('Access Token expired. Running 401 handling...');
            
            const newToken = await refreshToken();
            if (!newToken) {
                console.error('Refresh failed. Redirecting to login...');
                signOut();
                return;
            }
        }

        action();
    }, [refreshToken, signOut]);

    const signIn = useCallback((email: string, password: string) => {
        const foundUser = users.find(user =>
            user.email === email && user.password === password
        );

        if (!foundUser) {
            return null
        };

        localStorage.setItem('access_token', 'fake-access-' + Date.now());
        localStorage.setItem('refresh_token', 'fake-refresh-' + Date.now());
        localStorage.setItem('token_expires_at', (Date.now() + 10 * 1000).toString());

        setCurrentUser(foundUser);
        return foundUser;
    }, [users]);

    const signUp = useCallback((email: string, password: string) => {
        const alreadyExists = users.some(user => user.email === email);
        if (alreadyExists) {
            return false;
        }

        const maxId = users.length > 0 ? Math.max(...users.map(n => Number(n.id))) : 0;

        const newUser: User = {
            id: maxId + 1,
            email,
            password,
            username: `username${maxId + 1}`,
            notes: []
        };

        setUsers(prev => [...prev, newUser]);

        signIn(email, password);
        return true;
    }, [users, signIn]);

    return (
        <AuthContext.Provider value={{ currentUser, setUsers, setCurrentUser, signIn, signUp, signOut, refreshToken, requestWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
}