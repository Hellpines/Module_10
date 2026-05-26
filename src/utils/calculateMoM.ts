import { Note } from '../types/notes/Note';

export const calculateMoM = (notes: Note[]): string => {
    if (!notes || notes.length === 0) return '0%';

    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    let currentMonthCount = 0;
    let previousMonthCount = 0;

    notes.forEach((note) => {
        if (!note.createdAt) return;

        const noteDate = new Date(note.createdAt);

        if (noteDate >= startOfCurrentMonth && noteDate <= now) {
            currentMonthCount++;
        } else if (noteDate >= startOfPreviousMonth && noteDate <= endOfPreviousMonth) {
            previousMonthCount++;
        }
    });

    if (previousMonthCount === 0) {
        return currentMonthCount > 0 ? '+100%' : '0%';
    }

    const percentChange = Math.round(
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
    );

    return percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;
};
