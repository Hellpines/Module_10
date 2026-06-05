import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Checkbox from './Checkbox';

describe('Checkbox component', () => {
    test('should render with the correct label and link it to the input', () => {
        render(
            <Checkbox checkboxId={1} label='Accept terms' checked={false} onChange={jest.fn()} />
        );

        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute('id', 'checkbox-1');
    });

    test('should display checked state correctly when true', () => {
        render(
            <Checkbox checkboxId={1} label='Accept terms' checked={true} onChange={jest.fn()} />
        );

        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        expect(checkbox).toBeChecked();
    });

    test('should display checked state correctly when false', () => {
        render(
            <Checkbox checkboxId={1} label='Accept terms' checked={false} onChange={jest.fn()} />
        );

        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        expect(checkbox).not.toBeChecked();
    });

    test('should call onChange callback when clicked', () => {
        const mockOnChange = jest.fn();
        render(
            <Checkbox checkboxId={1} label='Accept terms' checked={false} onChange={mockOnChange} />
        );

        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        userEvent.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    test('should stop click event propagation', () => {
        const mockParentClick = jest.fn();
        const mockOnChange = jest.fn();

        render(
            <div onClick={mockParentClick}>
                <Checkbox
                    checkboxId={1}
                    label='Accept terms'
                    checked={false}
                    onChange={mockOnChange}
                />
            </div>
        );

        const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
        userEvent.click(checkbox);

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockParentClick).not.toHaveBeenCalled();
    });
});
