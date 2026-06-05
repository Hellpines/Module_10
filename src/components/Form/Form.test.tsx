import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Form from './Form';
import { FormProps } from '../../types/props/FormProps';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock(
    'react-router-dom',
    () => ({
        NavLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
            <a href={to}>{children}</a>
        ),
    }),
    { virtual: true }
);

jest.mock('../../assets/icons/letter-icon.svg', () => ({ ReactComponent: 'span' }), {
    virtual: true,
});
jest.mock('../../assets/icons/eye.svg', () => ({ ReactComponent: 'span' }), { virtual: true });
jest.mock('../../assets/icons/check.svg', () => ({ ReactComponent: 'span' }), { virtual: true });
jest.mock('../../assets/icons/cross.svg', () => ({ ReactComponent: 'span' }), { virtual: true });

describe('Form Component', () => {
    let mockOnSubmit: jest.Mock;
    let mockHandleSubmit: jest.Mock;
    let defaultProps: FormProps;

    beforeEach(() => {
        mockOnSubmit = jest.fn();
        mockHandleSubmit = jest.fn((cb) => (e: React.SubmitEvent) => {
            e.preventDefault();
            cb();
        });

        defaultProps = {
            legendTitle: 'Welcome',
            legendSubTitle: 'Please login',
            submitButtonTitle: 'Submit',
            isSignUp: false,
            redirectText: 'Don have an account?',
            hrefLink: '/signup',
            hrefLinkText: 'Sign Up',
            handleSubmit: mockHandleSubmit as unknown as FormProps['handleSubmit'],
            onSubmit: mockOnSubmit,
            register: jest.fn().mockReturnValue({}),
            errors: {},
            email: '',
            password: '',
        };
    });

    test('renders form fields and titles correctly', () => {
        render(<Form {...defaultProps} />);

        expect(screen.queryByText('Welcome')).not.toBeNull();
        expect(screen.queryByText('Please login')).not.toBeNull();
        expect(screen.queryByText('form.email')).not.toBeNull();
        expect(screen.queryByText('form.password')).not.toBeNull();
    });

    test('triggers submit handlers on form submission', () => {
        const { container } = render(<Form {...defaultProps} />);
        const form = container.querySelector('form');

        expect(form).not.toBeNull();
        if (form) {
            fireEvent.submit(form);
        }

        expect(mockHandleSubmit).toHaveBeenCalled();
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    test('renders agreement text only when isSignUp is true', () => {
        const { rerender } = render(<Form {...defaultProps} isSignUp={false} />);
        expect(screen.queryByText(/form\.agreementText/)).toBeNull();

        rerender(<Form {...defaultProps} isSignUp={true} />);
        expect(screen.queryByText(/form\.agreementText/)).not.toBeNull();
    });
});
