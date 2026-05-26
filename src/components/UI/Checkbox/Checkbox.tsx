import style from './checkbox.module.css';
import { CheckboxProps } from '../../../types/ui/CheckboxProps';

function Checkbox({ checkboxId, label, checked, onChange }: CheckboxProps) {
    return (
        <div className={style.checkboxWrapper}>
            <input
                className={style.checkboxInput}
                type='checkbox'
                id={`checkbox-${checkboxId}`}
                checked={checked}
                onChange={onChange}
                onClick={(e) => e.stopPropagation()}
            />
            <label htmlFor={`checkbox-${checkboxId}`}>{label}</label>
        </div>
    );
}
export default Checkbox;
