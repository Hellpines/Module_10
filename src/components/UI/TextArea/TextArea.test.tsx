import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TextArea from './TextArea';

describe('TextArea component', () => {
    test('should render with correct id, placeholder, and accessibility label', () => {
        render(
            <TextArea
                id='description'
                placeholder='Enter description here'
                className=''
                value=''
                onChange={jest.fn()}
            />
        );

        const textAreaElement = screen.getByPlaceholderText('Enter description here');
        expect(textAreaElement).toBeInTheDocument();
        expect(textAreaElement).toHaveAttribute('id', 'description');
        expect(textAreaElement).toHaveAttribute('aria-label', 'Enter description here');
    });

    test('should display the provided value correctly', () => {
        render(
            <TextArea
                id='description'
                placeholder='Enter description here'
                className=''
                value='Hello World'
                onChange={jest.fn()}
            />
        );

        const textAreaElement = screen.getByPlaceholderText('Enter description here');
        expect(textAreaElement).toHaveValue('Hello World');
    });

    test('should call onChange callback when the user types', () => {
        const mockOnChange = jest.fn();
        render(
            <TextArea
                id='description'
                placeholder='Enter description here'
                className=''
                value=''
                onChange={mockOnChange}
            />
        );

        const textAreaElement = screen.getByPlaceholderText('Enter description here');
        userEvent.type(textAreaElement, 'A');

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('should apply custom className alongside module styles', () => {
        render(
            <TextArea
                id='description'
                placeholder='Enter description here'
                className='custom-textarea-class'
                value=''
                onChange={jest.fn()}
            />
        );

        const textAreaElement = screen.getByPlaceholderText('Enter description here');
        expect(textAreaElement).toHaveClass('custom-textarea-class');
    });
});
