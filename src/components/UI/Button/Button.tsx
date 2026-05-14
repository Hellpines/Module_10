import style from './button.module.css';
import { ButtonProps } from '../../../types/ButtonProps';

function Button({ title, type, onClick }: ButtonProps) {
    return (
        <button 
            type={type}
            className={style.button} 
            onClick={onClick} 
        >
            {title}
        </button>
    )
}

export default Button