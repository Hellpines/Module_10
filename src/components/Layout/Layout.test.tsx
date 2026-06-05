import { render, screen } from '@testing-library/react';

import Layout from './Layout';
import { LayoutProps } from '../../types/props/LayoutProps';

jest.mock('../Header/Header', () => {
    return function MockHeader({ pageStatus }: { pageStatus: string }) {
        return <div data-testid='mock-header'>Header: {pageStatus}</div>;
    };
});

jest.mock('../Aside/Aside', () => {
    return function MockAside({ pageStatus }: { pageStatus: string }) {
        return <div data-testid='mock-aside'>Aside: {pageStatus}</div>;
    };
});

jest.mock('../Footer/Footer', () => {
    return function MockFooter() {
        return <div data-testid='mock-footer'>Footer</div>;
    };
});

describe('Layout Component', () => {
    test('renders Header, Aside, Footer, and children inside main when status is Authorized', () => {
        render(
            <Layout pageStatus='Authorized'>
                <div data-testid='child-content'>Main Content</div>
            </Layout>
        );

        expect(screen.queryByTestId('mock-header')).not.toBeNull();
        expect(screen.getByTestId('mock-header').textContent).toBe('Header: Authorized');

        expect(screen.queryByTestId('mock-aside')).not.toBeNull();
        expect(screen.getByTestId('mock-aside').textContent).toBe('Aside: Authorized');

        expect(screen.queryByRole('main')).not.toBeNull();
        expect(screen.queryByTestId('child-content')).not.toBeNull();

        expect(screen.queryByTestId('mock-footer')).not.toBeNull();
    });

    test('renders Header, Footer, and children without Aside when status is NotAuthorized', () => {
        render(
            <Layout pageStatus={'NotAuthorized' as LayoutProps['pageStatus']}>
                <div data-testid='child-content'>Auth Content</div>
            </Layout>
        );

        expect(screen.queryByTestId('mock-header')).not.toBeNull();
        expect(screen.getByTestId('mock-header').textContent).toBe('Header: NotAuthorized');

        expect(screen.queryByTestId('mock-aside')).toBeNull();
        expect(screen.queryByRole('main')).toBeNull();

        expect(screen.queryByTestId('child-content')).not.toBeNull();
        expect(screen.queryByTestId('mock-footer')).not.toBeNull();
    });
});
