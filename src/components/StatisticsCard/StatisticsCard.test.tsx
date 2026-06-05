import { render, screen } from '@testing-library/react';
import StatisticsCard from './StatisticsCard';
import { StatisticsCardProps } from '../../types/props/StatisticsCardProps';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: { percent: string | number }) => {
            if (options && 'percent' in options) {
                return `${key} [percent: ${options.percent}]`;
            }
            return key;
        },
    }),
}));

describe('StatisticsCard Component', () => {
    let defaultProps: StatisticsCardProps;

    beforeEach(() => {
        defaultProps = {
            title: 'Total Notes Created',
            value: 128,
            percent: '+12%',
        };
    });

    const renderCard = (props = defaultProps) => {
        return render(<StatisticsCard {...props} />);
    };

    test('renders title and quantitative values correctly from props', () => {
        renderCard();

        expect(screen.getByText('Total Notes Created')).not.toBeNull();
        expect(screen.getByText('128')).not.toBeNull();
    });

    test('interpolates translation parameters correctly with percentage delta trends', () => {
        renderCard({
            title: 'Archived Notes',
            value: 45,
            percent: '-5%',
        });

        expect(screen.getByText('profile.monthOverMonth [percent: -5%]')).not.toBeNull();
    });

    test('handles numeric percent values gracefully if provided', () => {
        renderCard({
            title: 'Trash Count',
            value: 12,
            percent: '0',
        });

        expect(screen.getByText('profile.monthOverMonth [percent: 0]')).not.toBeNull();
    });
});
