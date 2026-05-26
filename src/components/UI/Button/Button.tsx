import style from './button.module.css';
import { ButtonProps } from '../../../types/ui/ButtonProps';

function Button({ className, title, type = 'button', onClick, disabled }: ButtonProps) {
    return (
        <button
            type={type}
            className={`${style.button} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    );
}

export default Button;
