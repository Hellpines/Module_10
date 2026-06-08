import { renderHook } from '@testing-library/react';
import { useNotes } from './useNotes';

describe('useNotes hook', () => {
    test('should throw an error when used outside of an NotesProvider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useNotes())).toThrow(
            'useNotes must be used within an NotesProvider'
        );

        consoleSpy.mockRestore();
    });
});
