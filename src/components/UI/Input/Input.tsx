import style from './input.module.css';
import { InputProps } from '../../../types/InputProps';
import { ReactComponent as EyeIcon } from '../../../assets/icons/eye.svg';
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-off.svg';
import { ReactComponent as ThumbsUp } from '../../../assets/icons/thumbs-up.svg';
import { ReactComponent as MiniError } from '../../../assets/icons/mini-error-icon.svg';

function Input({ id, type, placeholder, className, value, onChange, error, message, rightIcon, isPassword, showPassword, togglePassword, autoComplete }: InputProps) {

    return (
        <div className={style.inputWrapper}>
            <div className={style.inputContainer}>
                <input
                    id={id}
                    type={isPassword ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    className={`
                        ${className || ''}
                        ${style.customInput}
                        ${error ? style.error : ''}
                    `}
                    value={value || ''}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />

                {rightIcon && (
                    <div className={style.validationIcon}>
                        {rightIcon}
                    </div>
                )}

                {isPassword && (
                    <button
                        type='button'
                        className={style.eyeButton}
                        onClick={togglePassword}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon className={style.eyeIcon} />}
                    </button>
                )}
            </div>

            {message && (
                error ? (
                    <div className={style.messageContainer}>
                        <MiniError />

                        <p className={style.errorMessage}>
                            {message}
                        </p>
                    </div>
                ) : (
                    <div className={style.messageContainer}>
                        {isPassword && <ThumbsUp />}

                        <p className={style.successMessage}>
                            {message}
                        </p>
                    </div>
                )
            )}
        </div>
    )
}

export default Input