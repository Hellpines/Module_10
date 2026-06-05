import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotesContext } from '../../context/NotesContext';
import Modal from './Modal';
import { ModalProps } from '../../types/props/ModalProps';
import { Note } from '../../types/notes/Note';

let mockUpdateTodoBackground: jest.Mock<void, [number, string]>;
let mockToggleChecklistItem: jest.Mock<void, [number, number]>;
let mockHandleClose: jest.Mock<void, []>;
let mockOnSave: jest.Mock<void, [Note]>;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        currentUser: { id: 'user-123', username: 'testuser' },
    }),
}));

jest.mock('../../hooks/useFocus', () => ({
    useFocus: jest.fn(),
}));

jest.mock('../../assets/icons/close-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});
jest.mock('../../assets/icons/letter-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});
jest.mock('../../assets/icons/pencil-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});
jest.mock('../../assets/icons/checkbox-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});

interface MockButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
}

interface MockCheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    checkboxId: number;
}

jest.mock('../UI/Button/Button', () => {
    return function MockButton({ title, onClick, className, ...props }: MockButtonProps) {
        return (
            <button onClick={onClick} className={className} {...props}>
                {title}
            </button>
        );
    };
});

jest.mock('../UI/Input/Input', () => {
    return function MockInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
        return <input {...props} />;
    };
});

jest.mock('../UI/TextArea/TextArea', () => {
    return function MockTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
        return <textarea {...props} />;
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

describe('Modal Component', () => {
    let defaultProps: ModalProps;
    let sampleNotes: Note[];

    beforeEach(() => {
        mockUpdateTodoBackground = jest.fn();
        mockToggleChecklistItem = jest.fn();
        mockHandleClose = jest.fn();
        mockOnSave = jest.fn();

        sampleNotes = [
            {
                id: 1,
                title: 'Existing Note',
                content: 'Existing Description',
                status: 'NOTES',
                userId: 1,
                items: [{ id: 101, text: 'Check item 1', isCompleted: false }],
                backgroundImage: 'bg-image-url',
            },
        ];

        defaultProps = {
            notes: sampleNotes,
            modalTitle: 'Create New Note',
            buttonTitle: 'Save Note',
            isCreateMode: true,
            handleClose: mockHandleClose,
            onSave: mockOnSave,
            title: undefined,
            items: undefined,
            content: undefined,
            noteId: undefined,
        };
    });

    const renderModal = (props = defaultProps) => {
        return render(
            <NotesContext.Provider
                value={
                    {
                        updateTodoBackground: mockUpdateTodoBackground,
                        toggleChecklistItem: mockToggleChecklistItem,
                    } as unknown as React.ContextType<typeof NotesContext>
                }
            >
                <Modal {...props} />
            </NotesContext.Provider>
        );
    };

    test('renders form controls and triggers saves correctly in Create Mode', () => {
        renderModal();

        expect(screen.queryByText('Create New Note')).not.toBeNull();

        const titleInput = screen.getByPlaceholderText('modal.enterTitle');
        const descTextArea = screen.getByPlaceholderText('modal.writeDesc');

        fireEvent.change(titleInput, { target: { value: 'New Test Title' } });
        fireEvent.change(descTextArea, { target: { value: 'New Test Description' } });

        const saveButton = screen.getByRole('button', { name: 'Save Note' });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 2,
                title: 'New Test Title',
                content: 'New Test Description',
                status: 'NOTES',
                userId: 'user-123',
            })
        );
        expect(mockHandleClose).toHaveBeenCalled();
    });

    test('manages adding, editing, and deleting checklist items safely', () => {
        renderModal();

        const addCheckboxButton = screen.getByRole('button', { name: 'modal.addCheckbox' });
        fireEvent.click(addCheckboxButton);

        const checklistInput = screen.getByPlaceholderText('modal.checkItem');
        fireEvent.change(checklistInput, { target: { value: 'Buy Groceries' } });

        const saveButton = screen.getByRole('button', { name: 'Save Note' });
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [{ id: 1, text: 'Buy Groceries', isCompleted: false }],
            })
        );

        renderModal();
        const deleteButton = screen.getByRole('button', { name: /modal.delete/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByPlaceholderText('modal.checkItem')).toBeNull();
    });

    test('renders in view mode when isCreateMode is false and toggles edit mode', () => {
        const viewProps: ModalProps = {
            notes: sampleNotes,
            modalTitle: 'Create New Note',
            buttonTitle: 'Save Note',
            isCreateMode: false,
            handleClose: mockHandleClose,
            onSave: mockOnSave,
            title: 'Existing Note',
            content: 'Existing Description',
            noteId: 1,
            items: [{ id: 101, text: 'Check item 1', isCompleted: false }],
        };

        renderModal(viewProps);

        expect(screen.queryByText('modal.viewTitle')).not.toBeNull();
        expect(screen.queryByText('Existing Note')).not.toBeNull();
        expect(screen.queryByText('Existing Description')).not.toBeNull();

        const editModeButton = screen.getByRole('button', { name: 'modal.editMode' });
        fireEvent.click(editModeButton);

        expect(screen.queryByPlaceholderText('modal.enterTitle')).not.toBeNull();
    });

    test('invokes toggleChecklistItem context function on checking items in view mode', () => {
        const viewProps: ModalProps = {
            notes: sampleNotes,
            modalTitle: 'Create New Note',
            buttonTitle: 'Save Note',
            isCreateMode: false,
            handleClose: mockHandleClose,
            onSave: mockOnSave,
            title: 'Existing Note',
            content: 'Existing Description',
            noteId: 1,
            items: [{ id: 101, text: 'Check item 1', isCompleted: false }],
        };

        renderModal(viewProps);

        const checkbox = screen.getByTestId('checkbox-101');
        fireEvent.click(checkbox);

        expect(mockToggleChecklistItem).toHaveBeenCalledWith(1, 101);
    });

    test('calls handleClose when closing operations are executed', () => {
        renderModal();

        const closeButton = screen.getByRole('button', { name: 'modal.close' });
        fireEvent.click(closeButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });

    test('updates background photo securely when file is chosen', () => {
        const editProps: ModalProps = {
            notes: sampleNotes,
            modalTitle: 'Edit Form',
            buttonTitle: 'Save Note',
            isCreateMode: false,
            handleClose: mockHandleClose,
            onSave: mockOnSave,
            title: 'Existing Note',
            content: 'Existing Description',
            noteId: 1,
            items: [],
        };

        const { container } = renderModal(editProps);

        const modeToggleButton = screen.getByRole('button', { name: 'modal.editMode' });
        fireEvent.click(modeToggleButton);

        const fileInput = container.querySelector('input[type="file"]');
        expect(fileInput).not.toBeNull();

        const dummyBase64 = 'data:image/png;base64,mock';
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        const fileReaderSpy = jest.spyOn(global, 'FileReader').mockImplementation(() => {
            const reader = {
                result: dummyBase64,
                readAsDataURL: jest.fn(function (this: FileReader) {
                    if (this.onloadend) {
                        this.onloadend({} as ProgressEvent<FileReader>);
                    }
                }),
            };
            return reader as unknown as FileReader;
        });

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [file] } });
        }

        const saveButton = screen.getByRole('button', { name: 'Save Note' });
        fireEvent.click(saveButton);

        expect(mockUpdateTodoBackground).toHaveBeenCalledWith(1, dummyBase64);
        fileReaderSpy.mockRestore();
    });
});
