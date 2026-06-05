import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
    test('renders footer with copyright text', () => {
        render(<Footer />);

        expect(screen.queryByText('© 2026 sidekick')).not.toBeNull();
    });
});
