'use client';

import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { ToggleProps } from '../../types/props/ToggleProps';
import style from './toggle.module.css';
import { useId } from 'react';

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(() => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'var(--accent)',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: 'var(--focus-border)',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: 'var(--border-color)',
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
        backgroundColor: '#fff',
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--border-color)',
        opacity: 1,
        transition: 'background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
}));

function Toggle({ onClick, toggleTitle, isActive }: ToggleProps) {
    const labelId = useId();

    return (
        <div className={style.toggleWrapper}>
            <IOSSwitch
                checked={isActive}
                onChange={onClick}
                id={labelId}
                slotProps={{ input: { 'aria-label': toggleTitle || 'Toggle' } }}
            />
            {toggleTitle && (
                <label htmlFor={labelId} className={style.toggleLabel}>
                    {toggleTitle}
                </label>
            )}
        </div>
    );
}

export default Toggle;
