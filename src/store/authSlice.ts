'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/auth/User';
import { AuthState } from '../types/auth/AuthState';
import { getAccessToken } from '../utils/getAccessToken';

const initialState: AuthState = {
    currentUser: null,
    token: getAccessToken(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.currentUser = action.payload;
        },

        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },

        logout(state) {
            state.currentUser = null;
            state.token = null;
        },
    },
});

export const { setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
