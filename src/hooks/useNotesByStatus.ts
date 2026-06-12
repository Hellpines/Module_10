'use client';

import { useQuery } from '@tanstack/react-query';
import { NoteStatus } from '../types/notes/NoteStatus';
import { fetchNotesByStatus } from '../utils/fetchNotesByStatus';

export const useNotesByStatus = (status: NoteStatus) => {
    return useQuery({
        queryKey: ['notes', status],
        queryFn: () => fetchNotesByStatus(status),
    });
};
