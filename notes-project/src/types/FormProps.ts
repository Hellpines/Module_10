export interface FormProps {
    submitForm: () => void;
    legendTitle: string;
    legendSubTitle: string;
    submitButtonTitle: string;
    isSignUp?: boolean;
    redirectText: string;
    hrefLink: string;
    hrefLinkText: string;
    email: string;
    password: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}