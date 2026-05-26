import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { SignFormData } from '../auth/SignFormData';

export interface FormProps {
    legendTitle: string;
    legendSubTitle: string;
    submitButtonTitle: string;
    isSignUp?: boolean;
    redirectText: string;
    hrefLink: string;
    hrefLinkText: string;

    register: UseFormRegister<SignFormData>;
    handleSubmit: UseFormHandleSubmit<SignFormData>;
    onSubmit: (data: SignFormData) => void;

    errors: FieldErrors<SignFormData>;

    email: string;
    password: string;
}
