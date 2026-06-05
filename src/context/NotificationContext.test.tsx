import { render, screen, fireEvent, act } from '@testing-library/react';
import { useContext } from 'react';
import { NotificationContext, NotificationProvider } from './NotificationContext';

const TestConsumer = () => {
    const context = useContext(NotificationContext);
    if (!context) return null;

    return (
        <div>
            <div data-testid='count'>{context.notifications.length}</div>
            <div data-testid='list'>
                {context.notifications.map((n) => (
                    <div key={n.id} data-testid={`notif-${n.id}`}>
                        <span>{n.message}</span>
                        <span>{n.type}</span>
                        <button onClick={() => context.closeNotification(n.id)}>
                            Close {n.id}
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={() => context.showNotifications('Success message', 'success')}>
                Add Success
            </button>
            <button onClick={() => context.showNotifications('Error message', 'error')}>
                Add Error
            </button>
        </div>
    );
};

describe('NotificationContext/NotificationProvider', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes with an empty notifications array', () => {
        render(
            <NotificationProvider>
                <TestConsumer />
            </NotificationProvider>
        );
        expect(screen.getByTestId('count').textContent).toBe('0');
    });

    test('adds a notification when showNotifications is called', () => {
        render(
            <NotificationProvider>
                <TestConsumer />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Add Success'));

        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('notif-1').textContent).toContain('Success message');
        expect(screen.getByTestId('notif-1').textContent).toContain('success');
    });

    test('increments ids correctly when adding multiple notifications', () => {
        render(
            <NotificationProvider>
                <TestConsumer />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Add Success'));
        fireEvent.click(screen.getByText('Add Error'));

        expect(screen.getByTestId('count').textContent).toBe('2');
        expect(screen.queryByTestId('notif-1')).not.toBeNull();
        expect(screen.queryByTestId('notif-2')).not.toBeNull();
    });

    test('removes notification when closeNotification is called manually', () => {
        render(
            <NotificationProvider>
                <TestConsumer />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Add Success'));
        expect(screen.getByTestId('count').textContent).toBe('1');

        fireEvent.click(screen.getByText('Close 1'));
        expect(screen.getByTestId('count').textContent).toBe('0');
    });

    test('automatically removes notification after 3000ms timeout', () => {
        render(
            <NotificationProvider>
                <TestConsumer />
            </NotificationProvider>
        );

        fireEvent.click(screen.getByText('Add Success'));
        expect(screen.getByTestId('count').textContent).toBe('1');

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(screen.getByTestId('count').textContent).toBe('0');
    });
});
