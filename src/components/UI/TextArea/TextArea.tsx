import style from './textarea.module.css';
import { TextAreaProps } from '../../../types/TextAreaProps';

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