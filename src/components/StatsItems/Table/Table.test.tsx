import { render, screen } from '@testing-library/react';
import Table from './Table';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Table Component', () => {
    const sampleData = [
        { monthSortKey: '2026-01', name: 'January', active: 15, archived: 5, trash: 2 },
        { monthSortKey: '2026-02', name: 'February', active: 22, archived: 3, trash: 8 },
    ];

    test('renders table column headers with correct translation keys', () => {
        render(<Table data={[]} />);

        expect(screen.getByRole('columnheader', { name: 'profile.tableMonth' })).not.toBeNull();
        expect(screen.getByRole('columnheader', { name: 'profile.tableCreated' })).not.toBeNull();
        expect(screen.getByRole('columnheader', { name: 'profile.tableArchived' })).not.toBeNull();
        expect(screen.getByRole('columnheader', { name: 'profile.tableDeleted' })).not.toBeNull();
    });

    test('renders structural row data accurately when records are provided', () => {
        render(<Table data={sampleData} />);

        expect(screen.getByRole('cell', { name: 'January' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '15' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '5' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '2' })).not.toBeNull();

        expect(screen.getByRole('cell', { name: 'February' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '22' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '3' })).not.toBeNull();
        expect(screen.getByRole('cell', { name: '8' })).not.toBeNull();

        expect(screen.queryByText('profile.noData')).toBeNull();
    });

    test('renders a full-width fallback cell layout when the dataset is empty', () => {
        render(<Table data={[]} />);

        const emptyCell = screen.getByRole('cell', { name: 'profile.noData' });
        expect(emptyCell).not.toBeNull();
        expect(emptyCell.getAttribute('colSpan')).toBe('4');

        expect(screen.queryByRole('cell', { name: 'January' })).toBeNull();
    });
});
