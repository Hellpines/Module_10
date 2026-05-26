import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { User } from '../types/auth/User';
import { graphqlRequest } from '../api/graphqlRequest';
import { logout, setToken, setUser } from '../store/authSlice';
import { USER_FIELDS } from '../constants/userFields';

export const useAuthMutations = (token: string | null) => {
    const dispatch = useDispatch();

    const fetchMe = useCallback(async (authToken: string) => {
        const data = await graphqlRequest<{ me: User }>(
            `query GetMe { 
                me { 
                    ${USER_FIELDS}
                } 
            }`,
            {},
            authToken
        );

        return data.me;
    }, []);

    const updateProfileMutation = useMutation({
        mutationFn: async ({
            updatedData,
            base64Image,
        }: {
            updatedData: Partial<User>;
            base64Image?: string;
        }) => {
            const inputPayload = {
                ...updatedData,
                ...(base64Image && { profileImage: base64Image }),
            };
            const data = await graphqlRequest<{ updateProfile: User }>(
                `
                    mutation UpdateProfile($input: UpdateProfileInput!) {
                        updateProfile(input: $input) {
                            ${USER_FIELDS}
                        }
                    }
                `,
                {
                    input: inputPayload,
                },
                token
            );

            return data.updateProfile;
        },

        onSuccess: (data) => {
            dispatch(setUser(data));
        },

        onError: (error) => {
            console.log(error);
        },
    });

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const data = await graphqlRequest<{
                login: {
                    token: string;
                    user: User;
                };
            }>(
                `
                    mutation Login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            token
                            user {
                                ${USER_FIELDS}
                            }
                        }
                    }
                `,
                {
                    email,
                    password,
                }
            );

            return data.login;
        },

        onSuccess: (data) => {
            localStorage.setItem('access_token', data.token);

            dispatch(setToken(data.token));
            dispatch(setUser(data.user));
        },

        onError: (error) => {
            console.log(error);
        },
    });

    const signUpMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            return await graphqlRequest<{
                signup: {
                    message: string;
                };
            }>(
                `
                    mutation Signup($email: String!, $password: String!) {
                        signup(email: $email, password: $password) {
                            message
                        }
                    }
                `,
                {
                    email,
                    password,
                }
            );
        },

        onError: (error) => {
            console.log(error);
        },
    });

    const signOutMutation = useMutation({
        mutationFn: async () => {
            await graphqlRequest(
                `
                    mutation Logout {
                        logout {
                            message
                        }
                    }
                `,
                {},
                token
            );
        },

        onSettled: () => {
            localStorage.removeItem('access_token');

            dispatch(logout());
        },
    });

    return {
        fetchMe,
        loginMutation,
        signUpMutation,
        signOutMutation,
        updateProfileMutation,
    };
};
