import { calculateMoM } from './calculateMoM';
import { Note } from '../types/notes/Note';

describe('calculateMoM utility', () => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2026-06-15T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should return "0%" if notes array is empty', () => {
        expect(calculateMoM([])).toBe('0%');
    });

    test('should return "+100%" if there were no notes last month but there are notes this month', () => {
        const mockNotes = [
            { id: 1, createdAt: '2026-06-05T10:00:00Z' },
            { id: 2, createdAt: '2026-06-10T10:00:00Z' },
        ] as Note[];

        expect(calculateMoM(mockNotes)).toBe('+100%');
    });

    test('should correctly calculate positive growth', () => {
        const mockNotes = [
            { id: 1, createdAt: '2026-05-10T10:00:00Z' },
            { id: 2, createdAt: '2026-05-20T10:00:00Z' },
            { id: 3, createdAt: '2026-06-01T10:00:00Z' },
            { id: 4, createdAt: '2026-06-05T10:00:00Z' },
            { id: 5, createdAt: '2026-06-12T10:00:00Z' },
        ] as Note[];

        expect(calculateMoM(mockNotes)).toBe('+50%');
    });

    test('should correctly calculate negative growth', () => {
        const mockNotes = [
            { id: 1, createdAt: '2026-05-10T10:00:00Z' },
            { id: 2, createdAt: '2026-05-15T10:00:00Z' },
            { id: 3, createdAt: '2026-05-20T10:00:00Z' },
            { id: 4, createdAt: '2026-05-25T10:00:00Z' },
            { id: 5, createdAt: '2026-06-05T10:00:00Z' },
            { id: 6, createdAt: '2026-06-10T10:00:00Z' },
        ] as Note[];

        expect(calculateMoM(mockNotes)).toBe('-50%');
    });

    test('should ignore notes without createdAt or outside the date ranges', () => {
        const mockNotes = [
            { id: 1, createdAt: '' },
            { id: 2, createdAt: undefined },
            { id: 3, createdAt: '2026-01-01T10:00:00Z' },
            { id: 4, createdAt: '2026-06-20T10:00:00Z' },
        ] as Note[];

        expect(calculateMoM(mockNotes)).toBe('0%');
    });
});
