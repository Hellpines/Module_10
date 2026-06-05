import { render, screen } from '@testing-library/react';
import React from 'react';

import Aside from './Aside';
import { AsideProps } from '../../types/props/AsideProps';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock(
    'react-router-dom',
    () => ({
        NavLink: ({
            to,
            children,
            className,
        }: {
            to: string;
            children: React.ReactNode;
            className?: string | ((props: { isActive: boolean }) => string);
        }) => {
            const resolvedClass =
                typeof className === 'function' ? className({ isActive: false }) : className;
            return (
                <a href={to} className={resolvedClass}>
                    {children}
                </a>
            );
        },
    }),
    { virtual: true }
);

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
