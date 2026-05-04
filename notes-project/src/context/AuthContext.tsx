import { createContext, useEffect, useState } from 'react';
import { users as initialUsers } from '../mocks/usersMock';
import { AuthContextParts } from '../types/AuthContextParts';
import { AuthProviderProps } from '../types/AuthProviderProps';
import { User } from '../types/User';

export const AuthContext = createContext<AuthContextParts | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [users, setUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    })

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('current-user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users])

    useEffect(() => {
        localStorage.setItem('current-user', JSON.stringify(currentUser));
    }, [currentUser]);

    const signIn = (email: string, password: string) => {
        const foundUser = users.find(user => {
            return user.email === email && user.password === password;
        });

        if (!foundUser) {
            return null;
        }

        setCurrentUser(foundUser);

        return foundUser;
    };

    const signUp = (email: string, password: string) => {
        const alreadyExists = users.some(user => user.email === email);

        if (alreadyExists) {
            return false;
        }

        const newUser: User = {
            id: Date.now(),
            email,
            password,
            notes: []
        };

        setUsers(prev => {
            return [...prev, newUser]
        });

        return true;
    };

    const signOut = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ users, currentUser, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

