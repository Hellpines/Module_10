import style from './checkbox.module.css';
import { CheckboxProps } from '../../../types/CheckboxProps';

function Checkbox({ checkboxId, flagCheckboxes, label, checked, onChange }: CheckboxProps) {
    return (
        <div className={style.checkboxWrapper}>
            {flagCheckboxes && 
                <input 
                    className={style.checkboxInput} 
                    type='checkbox' 
                    id={`checkbox-${checkboxId}`}
                    checked={checked} 
                    onChange={onChange} 
                    onClick={(e) => e.stopPropagation()}
                />
            }
            <label htmlFor={`checkbox-${checkboxId}`}>{label}</label>
        </div>
    )
}
export default Checkbox