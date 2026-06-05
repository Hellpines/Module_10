import { render, screen } from '@testing-library/react';

import InfoTextItem from './InfoTextItem';

jest.mock('../../assets/icons/info-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});

describe('InfoTextItem Component', () => {
    test('renders the inner text correctly', () => {
        const message = 'This is an informative notice.';
        render(<InfoTextItem innerText={message} />);

        expect(screen.queryByText(message)).not.toBeNull();
    });

    test('has the correct accessibility role and label', () => {
        render(<InfoTextItem innerText='Sample info' />);

        const noteElement = screen.getByRole('note');
        expect(noteElement).not.toBeNull();
        expect(noteElement.getAttribute('aria-label')).toBe('Information notice');
    });
});
