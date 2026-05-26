export interface ButtonProps {
    className?: string;
    title: string;
    type?: 'button' | 'submit';
    onClick?: () => void;
    disabled?: boolean;
}
