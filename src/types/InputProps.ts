import React from 'react';

export interface InputProps {
    id?: string;
    type: string;
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    message?: string;
    rightIcon?: React.ReactNode;
    isPassword?: boolean;
    showPassword?: boolean;
    togglePassword?: () => void;
    autoComplete?: string;
}