import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout, setToken, setUser } from '../store/authSlice';
import { AuthContextParts } from '../types/context/AuthContextParts';
import { ProviderProps } from '../types/props/ProviderProps';
import { User } from '../types/auth/User';
import { fileToBase64 } from '../utils/fileToBase64';
import { useAuthMutations } from '../hooks/useAuthMutations';
import { getAccessToken } from '../utils/getAccessToken';

export const AuthContext = createContext<AuthContextParts | null>(null);

export const AuthProvider = ({ children }: ProviderProps) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const reduxToken = useSelector((state: RootState) => state.auth.token);
    const token = reduxToken || getAccessToken();
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => !!getAccessToken());

    const { fetchMe, loginMutation, signUpMutation, signOutMutation, updateProfileMutation } =
        useAuthMutations(token);

    useEffect(() => {
        const savedToken = getAccessToken();

        if (savedToken && !reduxToken) {
            dispatch(setToken(savedToken));
        }
    }, [reduxToken, dispatch]);

    const getMe = useCallback(async () => {
        if (!token) {
            setIsAuthLoading(false);
            return null;
        }

        try {
            const user = await fetchMe(token);
            dispatch(setUser(user));
            return user;
        } catch (error) {
            console.log('Error with getting information about profile:', error);
            localStorage.removeItem('access_token');
            dispatch(logout());

            return null;
        } finally {
            setIsAuthLoading(false);
        }
    }, [token, fetchMe, dispatch]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (isMounted) {
                await getMe();
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [getMe]);

    const updateProfile = useCallback(
        async (updatedData: Partial<User>, file?: File) => {
            try {
                let base64Image: string | undefined = undefined;

                if (file) {
                    base64Image = await fileToBase64(file);
                }

                const data = await updateProfileMutation.mutateAsync({ updatedData, base64Image });
                return data;
            } catch (error) {
                console.error('Failed to update profile data:', error);
                return null;
            }
        },
        [updateProfileMutation]
    );

    const login = useCallback(
        async (email: string, password: string) => {
            try {
                const data = await loginMutation.mutateAsync({ email, password });

                return data.user;
            } catch {
                return null;
            }
        },
        [loginMutation]
    );

    const signUp = useCallback(
        async (email: string, password: string) => {
            try {
                await signUpMutation.mutateAsync({ email, password });

                return true;
            } catch {
                return false;
            }
        },
        [signUpMutation]
    );

    const signOut = useCallback(async () => {
        await signOutMutation.mutateAsync();
    }, [signOutMutation]);

    const contextValue = useMemo(
        () => ({
            currentUser,
            updateProfile,
            login,
            signUp,
            signOut,
            isAuthLoading,
        }),
        [currentUser, updateProfile, login, signUp, signOut, isAuthLoading]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
