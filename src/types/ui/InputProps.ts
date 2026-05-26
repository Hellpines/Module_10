import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id?: string;
    type: string;
    placeholder?: string;
    className?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    message?: string;
    rightIcon?: React.ReactNode;
    isPassword?: boolean;
    showPassword?: boolean;
    togglePassword?: () => void;
    autoComplete?: string;
}
