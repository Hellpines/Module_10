import type { User } from '../../src/types/auth/User';
import type { Note } from '../../src/types/notes/Note';
import type { NoteStatus } from '../../src/types/notes/NoteStatus';

export const MOCK_TOKEN = 'fake-jwt-token-e2e';

export const MOCK_USER: User = {
    id: 1,
    username: 'helenahills',
    firstName: 'Helena',
    secondName: 'Hills',
    email: 'helena.hills@social.com',
    description:
        'Team lead overseeing product development and architecture across multiple platforms.',
    lastLogin: '2026-06-03',
    creationDate: '2026-06-01',
    modifiedDate: '2026-06-02',
};

const createNote = (id: number, title: string, content: string, status: NoteStatus): Note => ({
    id,
    userId: MOCK_USER.id,
    title,
    content,
    status,
    items: [],
});

export const MOCK_NOTES: Record<NoteStatus, Note[]> = {
    NOTES: [
        createNote(
            1,
            'Weekly Project Report',
            'Prepare a summary of weekly progress for the team meeting on Friday. Focus on the integration of new components and the database structure.',
            'NOTES'
        ),
        createNote(2, 'Grocery Shopping List', '', 'NOTES'),
        createNote(
            3,
            'Ideas for Next Sprint',
            'Potential features for the next development cycle include user profile customization and adding social media buttons. Need to prioritize based on user feedback.',
            'NOTES'
        ),
        createNote(
            4,
            'Learning Design System Basics',
            'Dedicate two hours to watch the introductory course on atomic design principles and apply them to a small component in the local environment.',
            'NOTES'
        ),
        createNote(
            5,
            'Schedule a Dentist Appointment',
            "It's been over six months since the last check-up. Need to call the clinic before 5 PM.",
            'NOTES'
        ),
        createNote(6, 'Pay Monthly Bills', '', 'NOTES'),
    ],
    ARCHIVED: [
        createNote(101, 'Old meeting notes', 'Archived note used by e2e tests.', 'ARCHIVED'),
    ],
    TRASH: [createNote(201, 'Deleted draft', 'Trash note used by e2e tests.', 'TRASH')],
};
