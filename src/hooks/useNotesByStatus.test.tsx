import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNotesByStatus } from './useNotesByStatus';
import { fetchNotesByStatus } from '../utils/fetchNotesByStatus';
import { NoteStatus } from '../types/notes/NoteStatus';

jest.mock('../utils/fetchNotesByStatus', () => ({
    fetchNotesByStatus: jest.fn(),
}));

describe('useNotesByStatus hook', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;

    const mockStatus = 'NOTES' as NoteStatus;
    const mockNotes = [
        { id: '1', title: 'First Note', content: 'Clean code', status: 'NOTES' },
        { id: '2', title: 'Second Note', content: 'Write tests', status: 'NOTES' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    });

    test('should fetch notes successfully and return data', async () => {
        (fetchNotesByStatus as jest.Mock).mockResolvedValueOnce(mockNotes);

        const { result } = renderHook(() => useNotesByStatus(mockStatus), { wrapper });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(fetchNotesByStatus).toHaveBeenCalledWith(mockStatus);
        expect(fetchNotesByStatus).toHaveBeenCalledTimes(1);

        expect(result.current.data).toEqual(mockNotes);
    });

    test('should handle fetch errors correctly', async () => {
        const mockError = new Error('Network error');
        (fetchNotesByStatus as jest.Mock).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useNotesByStatus(mockStatus), { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(mockError);
        expect(result.current.data).toBeUndefined();
    });
});
