import style from './textarea.module.css';
import { TextAreaProps } from '../../../types/props/TextAreaProps';

function TextArea({ id, placeholder, className, value, onChange }: TextAreaProps) {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            className={`${className} ${style.textArea}`}
            value={value}
            onChange={onChange}
            aria-label={placeholder}
        />
    );
}

export default TextArea;
