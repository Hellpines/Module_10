import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Toggle from './Toggle';
import { ToggleProps } from '../../types/props/ToggleProps';

interface MockSwitchProps {
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    id?: string;
    slotProps?: {
        input?: {
            'aria-label'?: string;
        };
    };
}

jest.mock(
    '@mui/material/styles',
    () => ({
        styled:
            <P extends object>(Component: React.ComponentType<P>) =>
            () =>
                Component,
    }),
    { virtual: true }
);

jest.mock(
    '@mui/material/Switch',
    () => {
        return function MockSwitch({ checked, onChange, id, slotProps }: MockSwitchProps) {
            return (
                <input
                    type='checkbox'
                    data-testid='mui-switch-input'
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    aria-label={slotProps?.input?.['aria-label']}
                />
            );
        };
    },
    { virtual: true }
);

describe('Toggle Component', () => {
    let defaultProps: ToggleProps;
    let mockOnClick: jest.Mock;

    beforeEach(() => {
        mockOnClick = jest.fn();
        defaultProps = {
            onClick: mockOnClick,
            toggleTitle: 'Enable Dark Mode',
            isActive: false,
        };
        jest.clearAllMocks();
    });

    test('renders form toggle element with associated text description label', () => {
        render(<Toggle {...defaultProps} />);

        const textLabel = screen.getByText('Enable Dark Mode');
        expect(textLabel).not.toBeNull();

        const switchInput = screen.getByRole('checkbox');
        expect(switchInput.getAttribute('aria-label')).toBe('Enable Dark Mode');

        expect(switchInput.getAttribute('id')).toBe(textLabel.getAttribute('for'));
    });

    test('reflects active boolean state indicators onto internal interactive switch components', () => {
        const { rerender } = render(<Toggle {...defaultProps} isActive={false} />);

        let switchInput = screen.getByRole('checkbox') as HTMLInputElement;
        expect(switchInput.checked).toBe(false);

        rerender(<Toggle {...defaultProps} isActive={true} />);

        switchInput = screen.getByRole('checkbox') as HTMLInputElement;
        expect(switchInput.checked).toBe(true);
    });

    test('triggers internal change callbacks cleanly when state toggle mutations are initiated', () => {
        render(<Toggle {...defaultProps} />);

        const switchInput = screen.getByRole('checkbox');
        fireEvent.click(switchInput);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('applies safe accessible text fallbacks when explicit label configuration strings are empty', () => {
        render(<Toggle onClick={mockOnClick} isActive={false} toggleTitle='' />);

        expect(screen.queryByText('Enable Dark Mode')).toBeNull();

        const switchInput = screen.getByRole('checkbox');
        expect(switchInput.getAttribute('aria-label')).toBe('Toggle');
    });
});
