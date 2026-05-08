import React from 'react';

export interface TextAreaProps {
    id: string;
    placeholder: string;
    className?: string;
    value: string | number;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}