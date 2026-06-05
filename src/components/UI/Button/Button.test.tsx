import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button component', () => {
    test('should render with the correct title', () => {
        render(<Button title='Click me' />);

        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    test('should call onClick callback when clicked', () => {
        const mockOnClick = jest.fn();
        render(<Button title='Click me' onClick={mockOnClick} />);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        userEvent.click(buttonElement);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('should be disabled when disabled prop is true', () => {
        render(<Button title='Click me' disabled={true} />);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toBeDisabled();
    });

    test('should not trigger onClick when disabled', () => {
        const mockOnClick = jest.fn();
        render(<Button title='Click me' disabled={true} onClick={mockOnClick} />);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        userEvent.click(buttonElement);

        expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('should have default type attribute set to button', () => {
        render(<Button title='Click me' />);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toHaveAttribute('type', 'button');
    });

    test('should apply custom type attribute if provided', () => {
        render(<Button title='Submit' type='submit' />);

        const buttonElement = screen.getByRole('button', { name: /submit/i });
        expect(buttonElement).toHaveAttribute('type', 'submit');
    });

    test('should apply custom className alongside default styles', () => {
        render(<Button title='Click me' className='custom-class' />);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toHaveClass('custom-class');
    });
});
