import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from './Input';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../assets/icons/eye.svg', () => ({
    ReactComponent: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid='eye-icon' {...props} />
    ),
}));
jest.mock('../../../assets/icons/eye-off.svg', () => ({
    ReactComponent: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid='eye-off-icon' {...props} />
    ),
}));
jest.mock('../../../assets/icons/thumbs-up.svg', () => ({
    ReactComponent: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid='thumbs-up-icon' {...props} />
    ),
}));
jest.mock('../../../assets/icons/mini-error-icon.svg', () => ({
    ReactComponent: (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid='mini-error-icon' {...props} />
    ),
}));

describe('Input component', () => {
    test('should render input with correct type and placeholder', () => {
        render(<Input id='test-input' type='text' placeholder='Enter text' />);

        const inputElement = screen.getByPlaceholderText('Enter text');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute('type', 'text');
        expect(inputElement).toHaveAttribute('id', 'test-input');
    });

    test('should render as password field when isPassword is true and showPassword is false', () => {
        render(
            <Input
                type='password'
                placeholder='Password'
                isPassword={true}
                showPassword={false}
                togglePassword={jest.fn()}
            />
        );

        const inputElement = screen.getByPlaceholderText('Password');
        expect(inputElement).toHaveAttribute('type', 'password');

        const toggleButton = screen.getByRole('button', { name: 'input.showPassword' });
        expect(toggleButton).toBeInTheDocument();
    });

    test('should render as text field when isPassword is true and showPassword is true', () => {
        render(
            <Input
                type='password'
                placeholder='Password'
                isPassword={true}
                showPassword={true}
                togglePassword={jest.fn()}
            />
        );

        const inputElement = screen.getByPlaceholderText('Password');
        expect(inputElement).toHaveAttribute('type', 'text');

        const toggleButton = screen.getByRole('button', { name: 'input.hidePassword' });
        expect(toggleButton).toBeInTheDocument();
    });

    test('should call togglePassword when toggle button is clicked', () => {
        const mockTogglePassword = jest.fn();
        render(
            <Input
                type='password'
                placeholder='Password'
                isPassword={true}
                showPassword={false}
                togglePassword={mockTogglePassword}
            />
        );

        const toggleButton = screen.getByRole('button', { name: 'input.showPassword' });
        userEvent.click(toggleButton);

        expect(mockTogglePassword).toHaveBeenCalledTimes(1);
    });

    test('should display error message and set aria-invalid to true when error is provided', () => {
        render(
            <Input type='text' placeholder='Username' error={true} message='Username is required' />
        );

        const inputElement = screen.getByPlaceholderText('Username');
        expect(inputElement).toHaveAttribute('aria-invalid', 'true');

        const errorContainer = screen.getByRole('alert');
        expect(errorContainer).toHaveTextContent('Username is required');
    });

    test('should display success message and set aria-invalid to false when message is provided without error', () => {
        render(
            <Input
                type='text'
                placeholder='Username'
                error={false}
                message='Username is available'
            />
        );

        const inputElement = screen.getByPlaceholderText('Username');
        expect(inputElement).toHaveAttribute('aria-invalid', 'false');

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('Username is available')).toBeInTheDocument();
    });

    test('should render custom rightIcon when provided', () => {
        render(
            <Input
                type='text'
                placeholder='Search'
                rightIcon={<span data-testid='custom-icon' />}
            />
        );

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    test('should correctly forward ref to the input element', () => {
        const ref = createRef<HTMLInputElement>();
        render(<Input type='text' ref={ref} placeholder='Ref test' />);

        expect(ref.current).toBe(screen.getByPlaceholderText('Ref test'));
    });

    test('should apply custom className alongside default classes', () => {
        render(<Input type='text' placeholder='Class test' className='custom-input-class' />);

        const inputElement = screen.getByPlaceholderText('Class test');
        expect(inputElement).toHaveClass('custom-input-class');
    });
});
