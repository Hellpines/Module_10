import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ProfileItem from './ProfileItem';
import { ProfileItemProps } from '../../types/props/ProfileItemProps';

jest.mock(
    '../../assets/icons/arrow-icon.svg',
    () => ({
        ReactComponent: function MockArrowIcon(props: React.SVGProps<SVGSVGElement>) {
            return <span data-testid='arrow-icon' className={props.className} />;
        },
    }),
    { virtual: true }
);

describe('ProfileItem Component', () => {
    let defaultProps: ProfileItemProps;

    beforeEach(() => {
        defaultProps = {
            expandContainerTitle: 'Account Settings',
            className: 'custom-profile-class',
            children: <div data-testid='child-content'>Profile Content</div>,
        };
    });

    const renderProfileItem = (props = defaultProps) => {
        return render(<ProfileItem {...props} />);
    };

    test('renders in expanded state by default', () => {
        renderProfileItem();

        const toggleButton = screen.getByRole('button', { name: /Account Settings/i });
        expect(toggleButton).not.toBeNull();
        expect(toggleButton.getAttribute('aria-expanded')).toBe('true');

        const arrowIcon = screen.getByTestId('arrow-icon');
        expect(arrowIcon.className).toContain('arrowIcon');
        expect(arrowIcon.className).not.toContain('arrowIconReverted');

        const regionContainer = screen.getByRole('region');
        expect(regionContainer.hasAttribute('hidden')).toBe(false);
        expect(regionContainer.className).toContain('open');
        expect(regionContainer.className).toContain('custom-profile-class');

        expect(screen.getByTestId('child-content')).not.toBeNull();
    });

    test('toggles visibility states when interaction button is clicked', () => {
        renderProfileItem();

        const toggleButton = screen.getByRole('button', { name: /Account Settings/i });
        const regionContainer = screen.getByRole('region', { hidden: true });
        const arrowIcon = screen.getByTestId('arrow-icon');

        fireEvent.click(toggleButton);

        expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
        expect(regionContainer.hasAttribute('hidden')).toBe(true);
        expect(regionContainer.className).not.toContain('open');
        expect(arrowIcon.className).toContain('arrowIconReverted');

        fireEvent.click(toggleButton);

        expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
        expect(regionContainer.hasAttribute('hidden')).toBe(false);
        expect(regionContainer.className).toContain('open');
        expect(arrowIcon.className).toContain('arrowIcon');
    });
});
