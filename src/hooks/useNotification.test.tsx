import { renderHook } from '@testing-library/react';
import React from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { NotificationContextParts } from '../types/context/NotificationContextParts';
import { useNotification } from './useNotification';

describe('useNotification hook', () => {
    test('should throw an error when used outside of a NotificationProvider', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useNotification())).toThrow(
            'useNotification must be used within a NotificationProvider'
        );

        consoleSpy.mockRestore();
    });

    test('should return context value when used within a NotificationProvider', () => {
        const mockNotificationContextValue: NotificationContextParts = {
            notifications: [],
            showNotifications: jest.fn(),
            closeNotification: jest.fn(),
        };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <NotificationContext.Provider value={mockNotificationContextValue}>
                {children}
            </NotificationContext.Provider>
        );

        const { result } = renderHook(() => useNotification(), { wrapper });

        expect(result.current).toEqual(mockNotificationContextValue);
        expect(result.current.showNotifications).toBeDefined();
    });
});
