import { renderHook } from '@testing-library/react';
import { useFocus } from './useFocus';

describe('useFocus hook', () => {
    let container: HTMLDivElement;
    let firstButton: HTMLButtonElement;
    let secondButton: HTMLButtonElement;
    let lastButton: HTMLButtonElement;

    beforeEach(() => {
        container = document.createElement('div');
        firstButton = document.createElement('button');
        secondButton = document.createElement('button');
        lastButton = document.createElement('button');

        container.appendChild(firstButton);
        container.appendChild(secondButton);
        container.appendChild(lastButton);
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        document.body.style.overflow = '';
        jest.clearAllMocks();
    });

    test('should do nothing and keep/reset overflow when isActive is false', () => {
        const ref = { current: container };
        document.body.style.overflow = 'scroll';

        renderHook(() => useFocus(ref, false));

        expect(document.body.style.overflow).toBe('');
        expect(document.activeElement).not.toBe(firstButton);
    });

    test('should block body scroll and focus first element when isActive is true', () => {
        const ref = { current: container };

        renderHook(() => useFocus(ref, true));

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.activeElement).toBe(firstButton);
    });

    test('should call onEscape callback when Escape key is pressed', () => {
        const ref = { current: container };
        const mockOnEscape = jest.fn();

        renderHook(() => useFocus(ref, true, mockOnEscape));

        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(escapeEvent);

        expect(mockOnEscape).toHaveBeenCalledTimes(1);
    });

    test('should wrap focus to last element on Shift + Tab from the first element', () => {
        const ref = { current: container };
        renderHook(() => useFocus(ref, true));

        firstButton.focus();

        const tabShiftEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
        });

        window.dispatchEvent(tabShiftEvent);

        expect(document.activeElement).toBe(lastButton);
    });

    test('should wrap focus to first element on Tab from the last element', () => {
        const ref = { current: container };
        renderHook(() => useFocus(ref, true));

        lastButton.focus();

        const tabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
            bubbles: true,
        });

        window.dispatchEvent(tabEvent);

        expect(document.activeElement).toBe(firstButton);
    });

    test('should not change focus if Tab is pressed on a middle element', () => {
        const ref = { current: container };
        renderHook(() => useFocus(ref, true));

        secondButton.focus();

        const tabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
            bubbles: true,
        });

        window.dispatchEvent(tabEvent);

        expect(document.activeElement).toBe(secondButton);
    });

    test('should clean up listeners and styles on unmount', () => {
        const ref = { current: container };
        const mockOnEscape = jest.fn();

        const { unmount } = renderHook(() => useFocus(ref, true, mockOnEscape));

        expect(document.body.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('');

        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        window.dispatchEvent(escapeEvent);
        expect(mockOnEscape).not.toHaveBeenCalled();
    });
});
