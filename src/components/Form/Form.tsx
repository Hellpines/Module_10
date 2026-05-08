import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import style from './form.module.css';
import { FormProps } from '../../types/FormProps'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LetterIcon } from '../../assets/icons/letter-icon.svg';
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';

function Form({ submitForm, legendTitle, legendSubTitle, submitButtonTitle, isSignUp, redirectText, hrefLink, hrefLinkText, email, password, setEmail, setPassword }: FormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

    return (
        <form className={style.form} onSubmit={(e) => {
            e.preventDefault();

            setIsSubmitted(true);

            if ((!isEmailValid || !isPasswordValid) && isSignUp) {
                return;
            }

            submitForm();
        }}>
            <div className={style.legendBlock}>
                <p>{legendTitle}</p>
                <p>{legendSubTitle}</p>
            </div>

            <div className={style.inputs}>
                <div className={style.input}>
                    <label htmlFor='email'>
                        <LetterIcon className={style.letterIcon} />
                        Email
                    </label>
                    <Input
                        id='email'
                        type='email'
                        placeholder='Enter email'
                        className={style.emailInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={isSignUp && isSubmitted && !isEmailValid}
                        message={
                            isSignUp
                                ? isSubmitted
                                    ? isEmailValid
                                        ? ''
                                        : 'Email is not valid'
                                    : ''
                                : ''
                        }
                        rightIcon={
                            isSignUp
                                ? isSubmitted
                                    ? isEmailValid
                                        ? <CheckIcon />
                                        : <CrossIcon />
                                    : undefined
                                : undefined
                        }
                        autoComplete='email'
                    />
                </div>
                <div className={style.input}>
                    <label htmlFor='password'>
                        <EyeIcon className={style.eyeIcon} />
                        Password
                    </label>
                    <Input
                        id='password'
                        type='password'
                        placeholder='Enter password'
                        className={style.passwordInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={isSignUp && isSubmitted && !isPasswordValid}
                        message={
                            isSignUp
                                ? isSubmitted
                                    ? isPasswordValid
                                        ? 'Your password is strong'
                                        : 'Incorrect password'
                                    : ''
                                : ''
                        }
                        rightIcon={
                            isSignUp
                                ? isSubmitted
                                    ? isPasswordValid
                                        ? <CheckIcon />
                                        : <CrossIcon />
                                    : undefined
                                : undefined
                        }
                        isPassword
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />
                </div>
            </div>

            <Button
                title={submitButtonTitle}
                type='submit'
            />

            {isSignUp &&
                <p className={style.textAgreement}>
                    By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
                </p>
            }

            <p className={style.textRedirect}>{redirectText} <NavLink to={hrefLink}>{hrefLinkText}</NavLink></p>
        </form>
    )
}

export default Form