import { render, screen } from '@testing-library/react';
import React from 'react';

import Aside from './Aside';
import { AsideProps } from '../../types/props/AsideProps';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock(
    'next/link',
    () => ({
        __esModule: true,
        default: ({
            href,
            children,
            className,
        }: {
            href: string;
            children: React.ReactNode;
            className?: string;
        }) => (
            <a href={href} className={className}>
                {children}
            </a>
        ),
    }),
    { virtual: true }
);

jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Aside Component', () => {
    test('renders authorized navigation links', () => {
        render(<Aside pageStatus='Authorized' className='custom-aside' />);

        expect(screen.queryByText('aside.notes')).not.toBeNull();
        expect(screen.queryByText('aside.profile')).not.toBeNull();
        expect(screen.queryByText('aside.archive')).not.toBeNull();
        expect(screen.queryByText('aside.trash')).not.toBeNull();
        expect(screen.queryByText('aside.signIn')).toBeNull();
    });

    test('renders sign in and sign up links when not authorized', () => {
        render(
            <Aside
                pageStatus={'Unauthorized' as AsideProps['pageStatus']}
                className='custom-aside'
            />
        );

        expect(screen.queryByText('aside.signIn')).not.toBeNull();
        expect(screen.queryByText('aside.signUp')).not.toBeNull();
        expect(screen.queryByText('aside.notes')).toBeNull();
    });
});
