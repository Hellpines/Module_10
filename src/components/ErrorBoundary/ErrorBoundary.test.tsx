import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

jest.mock('../../pages/Error/Error', () => {
    return function MockErrorPage() {
        return <div data-testid='error-page'>Error Page</div>;
    };
});

const ProblemChild = () => {
    throw new Error('Test Error');
};

describe('ErrorBoundary Component', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid='normal-child'>Content</div>
            </ErrorBoundary>
        );

        expect(screen.queryByTestId('normal-child')).not.toBeNull();
        expect(screen.queryByTestId('error-page')).toBeNull();
    });

    test('renders Error page when a child throws an error', () => {
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(screen.queryByTestId('error-page')).not.toBeNull();
    });
});
