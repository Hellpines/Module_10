import { CheckboxProps } from '../../../types/CheckboxProps'
import style from './checkbox.module.css'

function Checkbox({ flagCheckboxes, label, checked, onChange }: CheckboxProps) {
    return (
        <div className={style.checkbox_wrapper}>
            {flagCheckboxes && 
                <input 
                    className={style.checkbox_input} 
                    type='checkbox' 
                    id='checkbox' 
                    checked={checked} 
                    onChange={onChange} 
                    onClick={(e) => e.stopPropagation()}
                />
            }
            <label className={style.checkbox_label} htmlFor='checkbox'>{label}</label>
        </div>
    )
}
export default Checkbox