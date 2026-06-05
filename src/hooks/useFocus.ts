import { RefObject, useEffect } from 'react';

export const useFocus = (
    containerRef: RefObject<HTMLElement | null>,
    isActive: boolean,
    onEscape?: () => void
) => {
    useEffect(() => {
        if (!isActive) {
            document.body.style.overflow = '';
            return;
        }

        document.body.style.overflow = 'hidden';

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            `a[href], button:not([disabled]), input:not([type='file']):not([disabled]), textarea:not([disabled]), [tabindex='0'], img[id]`
        );
        const firstElement = focusableElements[0] as HTMLElement | undefined;
        const lastElement = focusableElements[focusableElements.length - 1] as
            | HTMLElement
            | undefined;

        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onEscape?.();
                return;
            }

            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [containerRef, isActive, onEscape]);
};
