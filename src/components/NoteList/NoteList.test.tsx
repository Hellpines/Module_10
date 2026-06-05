import { render, screen, fireEvent } from '@testing-library/react';
import NoteList from './NoteList';
import { NoteListProps } from '../../types/props/NoteListProps';
import { Note as NoteType } from '../../types/notes/Note';
import { NoteProps } from '../../types/props/NoteProps';

let mockHandleOpenEditModal: jest.Mock<void, [NoteType]>;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        currentUser: { id: 1 },
    }),
}));

jest.mock('../Note/Note', () => {
    return function MockNote({ id, title, userId, handleOpenEditModal }: NoteProps) {
        const clickHandler = () => {
            if (handleOpenEditModal) {
                const fullNote: NoteType = {
                    id,
                    title: title || '',
                    content: '',
                    items: [],
                    status: 'NOTES',
                    userId: userId,
                };
                handleOpenEditModal(fullNote);
            }
        };

        return (
            <div data-testid={`note-${id}`} data-userid={userId}>
                <h2>{title}</h2>
                {handleOpenEditModal ? (
                    <button data-testid={`edit-btn-${id}`} onClick={clickHandler}>
                        Edit
                    </button>
                ) : (
                    <span data-testid={`no-edit-${id}`}>Read Only</span>
                )}
            </div>
        );
    };
});

describe('NoteList Component', () => {
    let sampleNotes: NoteType[];

    beforeEach(() => {
        mockHandleOpenEditModal = jest.fn();
        sampleNotes = [
            { id: 1, title: 'First Note', content: 'Content 1', status: 'NOTES', userId: 1 },
            { id: 2, title: 'Second Note', content: 'Content 2', status: 'NOTES', userId: 1 },
        ];
    });

    const renderNoteList = (props: NoteListProps) => {
        return render(<NoteList {...props} />);
    };

    test('renders main page label and correct notes with injected auth user id', () => {
        renderNoteList({
            notes: sampleNotes,
            handleOpenEditModal: mockHandleOpenEditModal,
            page: 'Notes',
        });

        const listContainer = screen.getByLabelText('noteList.mainLabel');
        expect(listContainer).not.toBeNull();

        const noteOne = screen.getByTestId('note-1');
        const noteTwo = screen.getByTestId('note-2');

        expect(noteOne.getAttribute('data-userid')).toBe('1');
        expect(noteTwo.getAttribute('data-userid')).toBe('1');
    });

    test('renders trash label and deprives notes of edit modal callback', () => {
        renderNoteList({
            notes: sampleNotes,
            handleOpenEditModal: mockHandleOpenEditModal,
            page: 'Trash',
        });

        expect(screen.queryByLabelText('noteList.trashLabel')).not.toBeNull();
        expect(screen.queryByTestId('edit-btn-1')).toBeNull();
        expect(screen.queryByTestId('no-edit-1')).not.toBeNull();
    });

    test('renders archive label and deprives notes of edit modal callback', () => {
        renderNoteList({
            notes: sampleNotes,
            handleOpenEditModal: mockHandleOpenEditModal,
            page: 'Archived',
        });

        expect(screen.queryByLabelText('noteList.archiveLabel')).not.toBeNull();
        expect(screen.queryByTestId('edit-btn-1')).toBeNull();
        expect(screen.queryByTestId('no-edit-1')).not.toBeNull();
    });

    test('allows click handler execution on standard pages', () => {
        renderNoteList({
            notes: [sampleNotes[0]],
            handleOpenEditModal: mockHandleOpenEditModal,
            page: 'Notes',
        });

        const editButton = screen.getByTestId('edit-btn-1');
        fireEvent.click(editButton);

        expect(mockHandleOpenEditModal).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                title: 'First Note',
                userId: 1,
            })
        );
    });
});
