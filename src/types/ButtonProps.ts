export interface ButtonProps {
    title: string;
    type?: 'button' | 'submit';
    onClick?: () => void;
}