import style from './input.module.css'
import { InputProps } from '../../../types/InputProps';

function Input({ id, type, placeholder, className, value, onChange, error, pattern }: InputProps) {
    return (
        <input 
            id={id} 
            type={type} 
            placeholder={placeholder} 
            className={`${className} ${style.custom_input} ${error ? style.error : ''}`}     
            value={value || ''}
            onChange={onChange}
            pattern={pattern}
        />
    )
}

export default Input