import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loader } from './Loader';

describe('Loader component', () => {
    test('should render with default "Loading..." label', () => {
        render(<Loader />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render with custom label when provided', () => {
        render(<Loader label='Please, wait...' />);

        expect(screen.getByText('Please, wait...')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
});
