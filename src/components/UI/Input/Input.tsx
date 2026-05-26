import React, { forwardRef } from 'react';
import style from './input.module.css';
import { InputProps } from '../../../types/ui/InputProps';

import { ReactComponent as EyeIcon } from '../../../assets/icons/eye.svg';
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-off.svg';
import { ReactComponent as ThumbsUp } from '../../../assets/icons/thumbs-up.svg';
import { ReactComponent as MiniError } from '../../../assets/icons/mini-error-icon.svg';
import { useTranslation } from 'react-i18next';

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            type,
            placeholder,
            className,
            error,
            message,
            rightIcon,
            isPassword,
            showPassword,
            togglePassword,
            autoComplete,
            ...props
        },
        ref
    ) => {
        const { t } = useTranslation();

        return (
            <div className={style.inputWrapper}>
                <div className={style.inputContainer}>
                    <input
                        ref={ref}
                        id={id}
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        className={`
                            ${className || ''}
                            ${style.customInput}
                            ${error ? style.error : ''}
                        `}
                        autoComplete={autoComplete}
                        aria-invalid={!!error}
                        {...props}
                    />

                    {rightIcon && <div className={style.validationIcon}>{rightIcon}</div>}

                    {isPassword && (
                        <button
                            type='button'
                            className={style.eyeButton}
                            onClick={togglePassword}
                            aria-label={
                                showPassword ? t('input.hidePassword') : t('input.showPassword')
                            }
                        >
                            {showPassword ? (
                                <EyeOffIcon aria-hidden='true' />
                            ) : (
                                <EyeIcon className={style.eyeIcon} aria-hidden='true' />
                            )}
                        </button>
                    )}
                </div>

                {message &&
                    (error ? (
                        <div className={style.messageContainer} role={error ? 'alert' : 'status'}>
                            <MiniError aria-hidden='true' />

                            <p className={style.errorMessage}>{message}</p>
                        </div>
                    ) : (
                        <div className={style.messageContainer}>
                            {isPassword && <ThumbsUp aria-hidden='true' />}

                            <p className={style.successMessage}>{message}</p>
                        </div>
                    ))}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
