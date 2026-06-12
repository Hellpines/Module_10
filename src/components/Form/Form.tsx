'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import style from './form.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { FormProps } from '../../types/props/FormProps';
import { ReactComponent as LetterIcon } from '../../assets/icons/letter-icon.svg';
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';

function Form({
    legendTitle,
    legendSubTitle,
    submitButtonTitle,
    isSignUp,
    redirectText,
    hrefLink,
    hrefLinkText,
    handleSubmit,
    onSubmit,
    register,
    errors,
    email,
    password,
}: FormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
    };

    const isEmailValid = useMemo(() => {
        return validateEmail(email || '');
    }, [email]);

    const isPasswordValid = useMemo(() => {
        return validatePassword(password || '');
    }, [password]);

    return (
        <form className={style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={style.legendBlock} role='group' aria-labelledby='form-title'>
                <h2 id='form-title' className={style.legendTitle}>
                    {legendTitle}
                </h2>
                <p className={style.legendSubTitle}>{legendSubTitle}</p>
            </div>

            <div className={style.inputs}>
                <div className={style.input}>
                    <label htmlFor='email' className={style.label}>
                        <LetterIcon className={style.letterIcon} aria-hidden='true' />
                        <span>{t('form.email')}</span>
                    </label>

                    <div className={style.inputWrapper}>
                        <Input
                            id='email'
                            type='email'
                            placeholder={t('form.enterEmail')}
                            className={style.emailInput}
                            error={!!errors.email}
                            message={errors.email?.message || ''}
                            aria-invalid={!!errors.email}
                            rightIcon={
                                isSignUp && email ? (
                                    <div aria-live='polite' className={style.statusIcon}>
                                        {isEmailValid ? (
                                            <CheckIcon aria-label={t('form.emailValid')} />
                                        ) : (
                                            <CrossIcon aria-label={t('form.emailInvalidFormat')} />
                                        )}
                                    </div>
                                ) : undefined
                            }
                            autoComplete='email'
                            {...register('email', {
                                required: t('form.emailRequired'),
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: t('form.emailInvalid'),
                                },
                            })}
                        />
                    </div>
                </div>

                <div className={style.input}>
                    <label htmlFor='password' className={style.label}>
                        <EyeIcon className={style.eyeIcon} aria-hidden='true' />
                        <span>{t('form.password')}</span>
                    </label>

                    <div className={style.inputWrapper}>
                        <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('form.enterPassword')}
                            className={style.passwordInput}
                            error={!!errors.password}
                            message={
                                errors.password?.message ||
                                (isSignUp && password && isPasswordValid
                                    ? t('form.passwordStrong')
                                    : '')
                            }
                            aria-invalid={!!errors.password}
                            rightIcon={
                                isSignUp && password ? (
                                    <div aria-live='polite' className={style.statusIcon}>
                                        {isPasswordValid ? (
                                            <CheckIcon aria-label={t('form.passwordStrongLabel')} />
                                        ) : (
                                            <CrossIcon aria-label={t('form.passwordWeakLabel')} />
                                        )}
                                    </div>
                                ) : undefined
                            }
                            isPassword
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            {...register('password', {
                                required: t('form.passwordRequired'),
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                                    message: t('form.passwordPattern'),
                                },
                            })}
                        />
                    </div>
                </div>
            </div>

            <Button title={submitButtonTitle} type='submit' />

            {isSignUp && (
                <p className={style.textAgreement}>
                    {t('form.agreementText')}{' '}
                    <a href='/terms' className={style.inlineLink}>
                        {t('form.terms')}
                    </a>{' '}
                    {t('form.and')}{' '}
                    <a href='/privacy' className={style.inlineLink}>
                        {t('form.privacy')}
                    </a>
                </p>
            )}

            <p className={style.textRedirect}>
                {redirectText} <Link href={hrefLink}>{hrefLinkText}</Link>
            </p>
        </form>
    );
}

export default Form;
