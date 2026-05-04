import { ButtonProps } from '../../../types/Button'
import style from './button.module.css'

function Button({ title, className, onClick, onSubmit }: ButtonProps) {
    return (
        <button 
            className={`${style.button} ${className}`} 
            onClick={onClick} 
            onSubmit={onSubmit}
        >
            {title}
        </button>
    )
}

export default Button