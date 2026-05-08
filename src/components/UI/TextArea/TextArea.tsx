import { TextAreaProps } from '../../../types/TextAreaProps';
import style from './textarea.module.css';

function TextArea({ id, placeholder, className, value, onChange }: TextAreaProps) {
    return (
        <textarea 
            id={id} 
            placeholder={placeholder} 
            className={`${className} ${style.textArea}`}
            value={value}
            onChange={onChange}
        />
    )
}

export default TextArea