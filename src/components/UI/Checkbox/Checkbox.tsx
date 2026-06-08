import style from './checkbox.module.css';
import { CheckboxProps } from '../../../types/ui/CheckboxProps';

function Checkbox({ checkboxId, label, checked, onChange }: CheckboxProps) {
    return (
        <div className={style.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
            <input
                className={style.checkboxInput}
                type='checkbox'
                id={`checkbox-${checkboxId}`}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={`checkbox-${checkboxId}`} className={style.checkboxLabel}>
                {label}
            </label>
        </div>
    );
}

export default Checkbox;
