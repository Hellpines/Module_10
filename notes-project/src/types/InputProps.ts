import React from "react";

export interface InputProps {
    id: string;
    type: string;
    placeholder: string;
    className?: string;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: boolean;
    pattern?: string;
}