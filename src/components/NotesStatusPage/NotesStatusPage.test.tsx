import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import NotesStatusPage from './NotesStatusPage';
import { NotesStatusPageProps } from '../../types/props/NotesStatusPageProps';
import { useNotesByStatus } from '../../hooks/useNotesByStatus';
import { Note as NoteType } from '../../types/notes/Note';

jest.mock('../../hooks/useNotesByStatus', () => ({
    useNotesByStatus: jest.fn(),
}));

jest.mock('../Layout/Layout', () => {
    return function MockLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid='mock-layout'>{children}</div>;
    };
});

jest.mock('../UI/Button/Button', () => {
    return function MockButton({
        onClick,
        title,
        disabled,
    }: {
        onClick: () => void;
        title: string;
        disabled: boolean;
    }) {
        return (
            <button onClick={onClick} disabled={disabled} data-testid='bulk-action-btn'>
                {title}
            </button>
        );
    };
});

jest.mock('../UI/Loader/Loader', () => ({
    Loader: function MockLoader({ label }: { label: string }) {
        return <div data-testid='mock-loader'>{label}</div>;
    },
}));

jest.mock('../NoteList/NoteList', () => {
    return function MockNoteList({ notes, page }: { notes: NoteType[]; page: string }) {
        return (
            <div data-testid='mock-note-list' data-page={page}>
                {notes.map((note) => (
                    <div key={note.id} data-testid={`note-item-${note.id}`}>
                        {note.title}
                    </div>
                ))}
            </div>
        );
    };
});

describe('NotesStatusPage Component', () => {
    let defaultProps: NotesStatusPageProps;
    let mockOnBulkAction: jest.Mock;

    beforeEach(() => {
        mockOnBulkAction = jest.fn();
        defaultProps = {
            status: 'ARCHIVED',
            page: 'Archived',
            onBulkAction: mockOnBulkAction,
            isBulkProcessing: false,
            buttonTitle: 'Empty Trash',
            buttonTitleProcessing: 'Emptying...',
            loadingLabel: 'Loading notes...',
            emptyText: 'No notes found here',
        };
        jest.clearAllMocks();
    });

    const mockHookResponse = (data: NoteType[], isLoading: boolean) => {
        (useNotesByStatus as jest.Mock).mockReturnValue({ data, isLoading });
    };

    test('renders loading screen and disables main bulk button when status hook returns loading state', () => {
        mockHookResponse([], true);
        render(<NotesStatusPage {...defaultProps} />);

        expect(screen.getByTestId('mock-loader')).not.toBeNull();
        expect(screen.getByText('Loading notes...')).not.toBeNull();
        expect(screen.queryByTestId('mock-note-list')).toBeNull();

        const actionBtn = screen.getByTestId('bulk-action-btn');
        expect(actionBtn.hasAttribute('disabled')).toBe(true);
        expect(actionBtn.textContent).toBe('Empty Trash');
    });

    test('renders empty view layout text when state resolves with zero records', () => {
        mockHookResponse([], false);
        render(<NotesStatusPage {...defaultProps} />);

        expect(screen.queryByTestId('mock-loader')).toBeNull();
        expect(screen.queryByTestId('mock-note-list')).toBeNull();

        const emptyStatus = screen.getByRole('status');
        expect(emptyStatus).not.toBeNull();
        expect(emptyStatus.textContent).toBe('No notes found here');

        const actionBtn = screen.getByTestId('bulk-action-btn');
        expect(actionBtn.hasAttribute('disabled')).toBe(true);
    });

    test('renders loaded records collection correctly via child component pipeline', () => {
        const dummyNotes: NoteType[] = [
            {
                id: 101,
                title: 'Archived Note One',
                content: '',
                items: [],
                status: 'ARCHIVED',
                userId: 1,
            },
            {
                id: 102,
                title: 'Archived Note Two',
                content: '',
                items: [],
                status: 'ARCHIVED',
                userId: 1,
            },
        ];
        mockHookResponse(dummyNotes, false);
        render(<NotesStatusPage {...defaultProps} />);

        expect(screen.queryByTestId('mock-loader')).toBeNull();
        expect(screen.queryByRole('status')).toBeNull();

        const noteList = screen.getByTestId('mock-note-list');
        expect(noteList).not.toBeNull();
        expect(noteList.getAttribute('data-page')).toBe('Archived');
        expect(screen.getByTestId('note-item-101')).not.toBeNull();
        expect(screen.getByTestId('note-item-102')).not.toBeNull();

        const actionBtn = screen.getByTestId('bulk-action-btn');
        expect(actionBtn.hasAttribute('disabled')).toBe(false);
    });

    test('triggers core bulk callback execution when processing trigger criteria are met', () => {
        const dummyNotes: NoteType[] = [
            {
                id: 101,
                title: 'Active Element',
                content: '',
                items: [],
                status: 'ARCHIVED',
                userId: 1,
            },
        ];
        mockHookResponse(dummyNotes, false);
        render(<NotesStatusPage {...defaultProps} />);

        const actionBtn = screen.getByTestId('bulk-action-btn');
        fireEvent.click(actionBtn);

        expect(mockOnBulkAction).toHaveBeenCalledTimes(1);
    });

    test('switches visual presentation titles and applies safety constraint disables when processing flag is enabled', () => {
        const dummyNotes: NoteType[] = [
            {
                id: 101,
                title: 'Active Element',
                content: '',
                items: [],
                status: 'ARCHIVED',
                userId: 1,
            },
        ];
        mockHookResponse(dummyNotes, false);
        render(<NotesStatusPage {...defaultProps} isBulkProcessing={true} />);

        const actionBtn = screen.getByTestId('bulk-action-btn');
        expect(actionBtn.textContent).toBe('Emptying...');
        expect(actionBtn.hasAttribute('disabled')).toBe(true);
    });
});
