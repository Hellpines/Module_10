import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Notification from './Notification';
import { useNotification } from '../../hooks/useNotification';
import { AppNotification } from '../../types/notification/AppNotification';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useNotification', () => ({
    useNotification: jest.fn(),
}));

jest.mock(
    '../../assets/icons/close-icon.svg',
    () => ({
        ReactComponent: function MockCloseIcon(props: React.SVGProps<SVGSVGElement>) {
            return <svg data-testid='mock-close-icon' {...props} />;
        },
    }),
    { virtual: true }
);

describe('Notification Component', () => {
    let mockCloseNotification: jest.Mock;

    beforeEach(() => {
        mockCloseNotification = jest.fn();
        jest.clearAllMocks();
    });

    const mockHookResponse = (notifications: AppNotification[] | undefined) => {
        (useNotification as jest.Mock).mockReturnValue({
            notifications,
            closeNotification: mockCloseNotification,
        });
    };

    test('renders nothing when notifications list is empty', () => {
        mockHookResponse([]);
        const { container } = render(<Notification />);
        expect(container.firstChild).toBeNull();
    });

    test('renders nothing when notifications list is undefined', () => {
        mockHookResponse(undefined);
        const { container } = render(<Notification />);
        expect(container.firstChild).toBeNull();
    });

    test('renders portal notifications correctly with specific message classes', () => {
        mockHookResponse([
            { id: '1', message: 'Success message', type: 'success' },
            { id: '2', message: 'Warning message', type: 'warning' },
            { id: '3', message: 'Error message', type: 'error' },
        ]);

        render(<Notification />);

        expect(screen.getByText('Success message')).not.toBeNull();
        expect(screen.getByText('Warning message')).not.toBeNull();
        expect(screen.getByText('Error message')).not.toBeNull();
        expect(screen.getAllByTestId('mock-close-icon')).toHaveLength(3);
    });

    test('triggers closeNotification action callback upon close button click interaction', () => {
        mockHookResponse([{ id: 'abc-123', message: 'Dismissible toast alert', type: 'success' }]);

        render(<Notification />);

        const closeButton = screen.getByRole('button', { name: 'notifications.close' });
        fireEvent.click(closeButton);

        expect(mockCloseNotification).toHaveBeenCalledTimes(1);
        expect(mockCloseNotification).toHaveBeenCalledWith('abc-123');
    });
});
