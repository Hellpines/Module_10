import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ActionsMenu from './ActionsMenu';
import { NotesContext } from '../../context/NotesContext';
import { ActionsMenuProps } from '../../types/props/ActionsMenuProps';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ActionsMenu Component', () => {
    const mockContext = {
        moveToTrash: jest.fn(),
        addToArchive: jest.fn(),
        removeFromArchive: jest.fn(),
        deleteTodo: jest.fn(),
    };

    const defaultProps: ActionsMenuProps = {
        note: {
            id: 1,
            title: 'Test Note',
            status: 'NOTES',
            items: [],
        } as unknown as ActionsMenuProps['note'],
        flagCheckboxes: false,
        status: 'NOTES',
        uncheckAll: jest.fn(),
        handleFlagCheckboxes: jest.fn(),
        onClose: jest.fn(),
    };

    const originalGetBoundingClientRect = HTMLDivElement.prototype.getBoundingClientRect;

    const renderWithContext = (props: Partial<ActionsMenuProps> = {}) => {
        return render(
            <NotesContext.Provider
                value={mockContext as unknown as React.ContextType<typeof NotesContext>}
            >
                <ActionsMenu {...defaultProps} {...props} />
            </NotesContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        });
    });

    afterEach(() => {
        HTMLDivElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    test('renders main actions for a regular note', () => {
        renderWithContext();
        expect(screen.queryByRole('menu')).not.toBeNull();
        expect(screen.queryByText('actionsMenu.deleteNote')).not.toBeNull();
        expect(screen.queryByText('actionsMenu.archive')).not.toBeNull();
    });

    test('calls moveToTrash context handler on delete click', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('actionsMenu.deleteNote'));
        expect(mockContext.moveToTrash).toHaveBeenCalledWith(1);
    });

    test('renders delete forever action when status is TRASH', () => {
        renderWithContext({ status: 'TRASH' });
        expect(screen.queryByText('actionsMenu.deleteForever')).not.toBeNull();
        fireEvent.click(screen.getByText('actionsMenu.deleteForever'));
        expect(mockContext.deleteTodo).toHaveBeenCalledWith(1);
    });

    test('triggers handleFlagCheckboxes prop when toggling checkboxes', () => {
        renderWithContext({ status: 'NOTES', flagCheckboxes: false });
        fireEvent.click(screen.getByText('actionsMenu.showCheckboxes'));
        expect(defaultProps.handleFlagCheckboxes).toHaveBeenCalled();
    });

    test('triggers handleFlagCheckboxes prop when toggling checkboxes to hide', () => {
        renderWithContext({ status: 'NOTES', flagCheckboxes: true });
        fireEvent.click(screen.getByText('actionsMenu.hideCheckboxes'));
        expect(defaultProps.handleFlagCheckboxes).toHaveBeenCalled();
    });

    test('calls addToArchive context handler when note status is not ARCHIVED', () => {
        renderWithContext();
        fireEvent.click(screen.getByText('actionsMenu.archive'));
        expect(mockContext.addToArchive).toHaveBeenCalledWith(1);
    });

    test('calls removeFromArchive context handler when note status is ARCHIVED', () => {
        renderWithContext({
            note: {
                id: 1,
                title: 'Archived Note',
                status: 'ARCHIVED',
                items: [],
            } as unknown as ActionsMenuProps['note'],
        });
        fireEvent.click(screen.getByText('actionsMenu.unarchive'));
        expect(mockContext.removeFromArchive).toHaveBeenCalledWith(1);
    });

    test('renders and triggers uncheckAll when active items exist and checkboxes are flagged', () => {
        const uncheckAllMock = jest.fn();
        renderWithContext({
            status: 'NOTES',
            flagCheckboxes: true,
            uncheckAll: uncheckAllMock,
            note: {
                id: 1,
                title: 'Note',
                status: 'NOTES',
                items: [{ isCompleted: true }],
            } as unknown as ActionsMenuProps['note'],
        });
        fireEvent.click(screen.getByText('actionsMenu.uncheckAll'));
        expect(uncheckAllMock).toHaveBeenCalled();
    });

    test('stops click event propagation on menu click', () => {
        renderWithContext();
        const menu = screen.getByRole('menu');
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const spy = jest.spyOn(clickEvent, 'stopPropagation');
        fireEvent(menu, clickEvent);
        expect(spy).toHaveBeenCalled();
    });

    test('sets leftUp position class when overflowing right and bottom', () => {
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            right: 2000,
            bottom: 2000,
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {},
        });
        renderWithContext();
        const menu = screen.getByRole('menu');
        expect(menu.className).toContain('leftUp');
    });

    test('sets leftDown position class when overflowing right only', () => {
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            right: 2000,
            bottom: 500,
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {},
        });
        renderWithContext();
        const menu = screen.getByRole('menu');
        expect(menu.className).toContain('leftDown');
    });

    test('sets rightUp position class when overflowing bottom only', () => {
        HTMLDivElement.prototype.getBoundingClientRect = () => ({
            right: 500,
            bottom: 2000,
            left: 0,
            top: 0,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {},
        });
        renderWithContext();
        const menu = screen.getByRole('menu');
        expect(menu.className).toContain('rightUp');
    });

    test('handles keyboard navigation with ArrowDown, ArrowUp, and Escape keys', () => {
        const onCloseMock = jest.fn();
        renderWithContext({ onClose: onCloseMock });
        const menu = screen.getByRole('menu');
        const buttons = screen.getAllByRole('menuitem');

        expect(document.activeElement).toBe(buttons[0]);

        fireEvent.keyDown(menu, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(buttons[1]);

        fireEvent.keyDown(menu, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(buttons[2]);

        fireEvent.keyDown(menu, { key: 'ArrowDown' });
        expect(document.activeElement).toBe(buttons[0]);

        fireEvent.keyDown(menu, { key: 'ArrowUp' });
        expect(document.activeElement).toBe(buttons[2]);

        fireEvent.keyDown(menu, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalled();
    });
});
