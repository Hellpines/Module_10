import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotesContext } from '../../context/NotesContext';
import Note from './Note';
import { NoteProps } from '../../types/props/NoteProps';
import { Note as NoteType } from '../../types/notes/Note';

let mockToggleChecklistItem: jest.Mock<void, [number, number]>;
let mockUncheckAllItems: jest.Mock<void, [number]>;
let mockHandleOpenEditModal: jest.Mock<void, [NoteType]>;

interface MockActionsMenuProps {
    note: Partial<NoteType>;
    status: string;
    flagCheckboxes: boolean;
    handleFlagCheckboxes: (e: React.MouseEvent<HTMLButtonElement>) => void;
    uncheckAll: () => void;
    onClose: () => void;
}

interface MockCheckboxProps {
    checkboxId: number;
    label: string;
    checked: boolean;
    onChange: () => void;
}

jest.mock('../../assets/icons/dots.svg', () => ({ ReactComponent: 'span' }), { virtual: true });

jest.mock('../ActionsMenu/ActionsMenu', () => {
    return function MockActionsMenu({
        handleFlagCheckboxes,
        uncheckAll,
        onClose,
    }: MockActionsMenuProps) {
        return (
            <div data-testid='mock-actions-menu'>
                <button
                    onClick={(e) =>
                        handleFlagCheckboxes(e as unknown as React.MouseEvent<HTMLButtonElement>)
                    }
                    data-testid='mock-toggle-checkboxes'
                >
                    Toggle Checkboxes
                </button>
                <button onClick={uncheckAll} data-testid='mock-uncheck-all'>
                    Uncheck All
                </button>
                <button onClick={onClose} data-testid='mock-close-menu'>
                    Close Menu
                </button>
            </div>
        );
    };
});

jest.mock('../UI/Checkbox/Checkbox', () => {
    return function MockCheckbox({ label, checked, onChange, checkboxId }: MockCheckboxProps) {
        return (
            <label>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={onChange}
                    data-testid={`checkbox-${checkboxId}`}
                />
                {label}
            </label>
        );
    };
});

describe('Note Component', () => {
    let defaultProps: NoteProps;

    beforeEach(() => {
        mockToggleChecklistItem = jest.fn();
        mockUncheckAllItems = jest.fn();
        mockHandleOpenEditModal = jest.fn();

        defaultProps = {
            id: 1,
            title: 'Test Title',
            content: 'Test Plain Content',
            items: [
                { id: 10, text: 'Item 1', isCompleted: false },
                { id: 20, text: 'Item 2', isCompleted: true },
            ],
            handleOpenEditModal: mockHandleOpenEditModal,
            status: 'NOTES',
            userId: 1,
            backgroundImage: undefined,
        };
    });

    const renderNote = (props = defaultProps, currentView: 'grid' | 'list' = 'grid') => {
        return render(
            <NotesContext.Provider
                value={
                    {
                        toggleChecklistItem: mockToggleChecklistItem,
                        uncheckAllItems: mockUncheckAllItems,
                        view: currentView,
                    } as unknown as React.ContextType<typeof NotesContext>
                }
            >
                <Note {...props} />
            </NotesContext.Provider>
        );
    };

    test('renders text content correctly and handles primary click actions', () => {
        renderNote();

        expect(screen.queryByText('Test Title')).not.toBeNull();
        expect(screen.queryByText('Test Plain Content')).not.toBeNull();

        const noteCard = screen.getByRole('button', { name: /Test Title\. Test Plain Content/i });
        fireEvent.click(noteCard);

        expect(mockHandleOpenEditModal).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                title: 'Test Title',
                content: 'Test Plain Content',
                userId: defaultProps.userId,
            })
        );
    });

    test('executes keydown listeners for keyboard control with space and enter buttons', () => {
        renderNote();

        const noteCard = screen.getByRole('button', { name: /Test Title\. Test Plain Content/i });

        fireEvent.keyDown(noteCard, { key: 'Enter', code: 'Enter' });
        expect(mockHandleOpenEditModal).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(noteCard, { key: ' ', code: 'Space' });
        expect(mockHandleOpenEditModal).toHaveBeenCalledTimes(2);
    });

    test('opens actions layout and handles inner execution flags correctly', () => {
        renderNote();

        expect(screen.queryByTestId('mock-actions-menu')).toBeNull();

        const dotsButton = screen.getByRole('button', { name: 'Note actions menu' });
        fireEvent.click(dotsButton);

        expect(screen.queryByTestId('mock-actions-menu')).not.toBeNull();

        const toggleCheckboxesBtn = screen.getByTestId('mock-toggle-checkboxes');
        fireEvent.click(toggleCheckboxesBtn);

        expect(screen.queryByText('Test Plain Content')).toBeNull();
        expect(screen.queryByText('Item 1')).not.toBeNull();

        const checkboxEl = screen.getByTestId('checkbox-10');
        fireEvent.click(checkboxEl);
        expect(mockToggleChecklistItem).toHaveBeenCalledWith(1, 10);
    });

    test('fires uncheckAll context action inside configuration workflow execution', () => {
        renderNote();

        const dotsButton = screen.getByRole('button', { name: 'Note actions menu' });
        fireEvent.click(dotsButton);

        const uncheckAllBtn = screen.getByTestId('mock-uncheck-all');
        fireEvent.click(uncheckAllBtn);

        expect(mockUncheckAllItems).toHaveBeenCalledWith(1);
    });

    test('closes actions layout window safely when target close routine is invoked', () => {
        renderNote();

        const dotsButton = screen.getByRole('button', { name: 'Note actions menu' });
        fireEvent.click(dotsButton);

        const closeMenuBtn = screen.getByTestId('mock-close-menu');
        fireEvent.click(closeMenuBtn);

        expect(screen.queryByTestId('mock-actions-menu')).toBeNull();
    });

    test('closes popover dynamically when background document root click is registered', () => {
        renderNote();

        const dotsButton = screen.getByRole('button', { name: 'Note actions menu' });
        fireEvent.click(dotsButton);

        expect(screen.queryByTestId('mock-actions-menu')).not.toBeNull();

        fireEvent.click(document.body);
        expect(screen.queryByTestId('mock-actions-menu')).toBeNull();
    });

    test('resolves asset configuration options for image url types cleanly', () => {
        const imageProps: NoteProps = {
            ...defaultProps,
            backgroundImage: 'http://localhost/asset-image.png',
        };

        renderNote(imageProps);
        const noteCard = screen.getByRole('button', { name: /Test Title/i });

        expect(noteCard.style.backgroundImage).toContain('http://localhost/asset-image.png');
    });

    test('resolves simple hex values as background css modifiers cleanly', () => {
        const colorProps: NoteProps = {
            ...defaultProps,
            backgroundImage: '#ff0000',
        };

        renderNote(colorProps);
        const noteCard = screen.getByRole('button', { name: /Test Title/i });

        expect(noteCard.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });
});
