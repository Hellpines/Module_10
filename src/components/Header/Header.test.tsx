import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Header from './Header';

interface TranslationOptions {
    username?: string;
}

let mockCurrentUser: { username: string } | null = null;
const mockSignOut = jest.fn();

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: TranslationOptions) =>
            options?.username ? `${key}_${options.username}` : key,
    }),
}));

jest.mock(
    'next/link',
    () => ({
        __esModule: true,
        default: ({
            href,
            children,
            onClick,
            className,
            'aria-label': ariaLabel,
        }: {
            href: string;
            children: React.ReactNode;
            onClick?: () => void;
            className?: string;
            'aria-label'?: string;
        }) => (
            <a href={href} onClick={onClick} className={className} aria-label={ariaLabel}>
                {children}
            </a>
        ),
    }),
    { virtual: true }
);

jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        currentUser: mockCurrentUser,
        signOut: mockSignOut,
    }),
}));

jest.mock('../../hooks/useFocus', () => ({
    useFocus: jest.fn(),
}));

jest.mock('../../utils/getAvatarPath', () => ({
    getAvatarPath: () => 'mock-avatar-path.png',
}));

jest.mock('../Aside/Aside', () => {
    return function MockAside() {
        return <div data-testid='aside-component' />;
    };
});

jest.mock('../../assets/images/logo.svg', () => ({ ReactComponent: 'span' }), { virtual: true });
jest.mock('../../assets/icons/burger-menu.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});

describe('Header Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCurrentUser = null;
    });

    test('renders auth links when user is NotAuthorized', () => {
        mockCurrentUser = null;
        render(<Header pageStatus='NotAuthorized' />);

        expect(screen.queryByText('header.signUp')).not.toBeNull();
        expect(screen.queryByText('header.signIn')).not.toBeNull();
        expect(screen.queryByText('testuser')).toBeNull();
    });

    test('renders user info, toggles user dropdown menu, and closes dropdown on profile link click', () => {
        mockCurrentUser = { username: 'testuser' };
        render(<Header pageStatus='Authorized' />);

        expect(screen.queryByText('testuser')).not.toBeNull();
        expect(screen.queryByText('aside.profile')).toBeNull();

        const userMenuButton = screen.getByRole('button', { name: /header\.userAvatar_testuser/i });

        fireEvent.click(userMenuButton);
        expect(screen.queryByText('aside.profile')).not.toBeNull();

        const profileLink = screen.getByRole('link', { name: 'aside.profile' });
        fireEvent.click(profileLink);
        expect(screen.queryByText('aside.profile')).toBeNull();

        fireEvent.click(userMenuButton);
        const logoutButton = screen.getByRole('button', { name: 'profile.logoutButton' });
        fireEvent.click(logoutButton);

        expect(mockSignOut).toHaveBeenCalled();
        expect(screen.queryByText('aside.profile')).toBeNull();
    });

    test('handles opening, inner click propagation, and closing of mobile burger menu', () => {
        render(<Header pageStatus='NotAuthorized' />);

        expect(screen.queryByTestId('aside-component')).toBeNull();

        const burgerButton = screen.getByRole('button', { name: 'header.burgerLabel' });
        expect(burgerButton.getAttribute('aria-expanded')).toBe('false');

        fireEvent.click(burgerButton);
        expect(screen.queryByTestId('aside-component')).not.toBeNull();
        expect(burgerButton.getAttribute('aria-expanded')).toBe('true');

        const dialogWrapper = screen.getByRole('dialog', { name: 'header.mobileMenuTitle' });

        const innerContent = screen.getByTestId('aside-component');
        fireEvent.click(innerContent);
        expect(screen.queryByTestId('aside-component')).not.toBeNull();

        fireEvent.click(dialogWrapper);
        expect(screen.queryByTestId('aside-component')).toBeNull();
        expect(burgerButton.getAttribute('aria-expanded')).toBe('false');
    });

    test('does not render burger menu controls when pageStatus is Error', () => {
        render(<Header pageStatus='Error' />);

        const burgerButton = screen.queryByRole('button', { name: 'header.burgerLabel' });
        expect(burgerButton).toBeNull();
    });

    test('renders user avatar inside the burger menu when authorized', () => {
        mockCurrentUser = { username: 'burgeruser' };
        render(<Header pageStatus='Authorized' />);

        const burgerButton = screen.getByRole('button', { name: 'header.burgerLabel' });
        fireEvent.click(burgerButton);

        const mobileAvatar = screen.getByRole('img', { name: 'header.avatar' });
        expect(mobileAvatar).not.toBeNull();
    });
});
