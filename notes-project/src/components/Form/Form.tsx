import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'
import style from './form.module.css'
import { FormProps } from '../../types/FormProps'
import { useState } from 'react';
import letterIcon from '../../assets/icons/letter-icon.svg'
import eyeIcon from '../../assets/icons/eye.svg'

function Form({ submitForm, legendTitle, legendSubTitle, submitButtonTitle, isSignUp, redirectText, hrefLink, hrefLinkText, email, password, setEmail, setPassword }: FormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();

            setIsSubmitted(true);
            
            if ((!isEmailValid || !isPasswordValid) && isSignUp) {
                return;
            }

            submitForm();  
        }}>
            <div className={style.legend_block}>
                <p>{legendTitle}</p>
                <p>{legendSubTitle}</p>
            </div>

            <div className={style.inputs}>
                <div className={style.input}>
                    <label htmlFor='email'><img src={letterIcon} alt='letter-icon'/>Email</label>
                    <Input 
                        id='email' 
                        type='email' 
                        placeholder='Enter email' 
                        className={style.email_input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={isSubmitted && !isEmailValid}
                    />
                </div>
                <div className={style.input}>
                    <label htmlFor='password'><img src={eyeIcon} alt='eye-icon'/>Password</label>
                    <Input 
                        id='password' 
                        type='password' 
                        placeholder='Enter password' 
                        className={style.password_input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={isSubmitted && !isPasswordValid}
                        pattern="^(?=.*[A-Za-z])(?=.*\d).{8,}$"
                    />
                </div>
            </div>
            
            <Button 
                className={style.submit_button} 
                title={submitButtonTitle} 
                onSubmit={submitForm}
            />
            {isSignUp && 
                <p className={style.text_agreement}>
                    By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
                </p>
            }
            <p className={style.text_redirect}>{redirectText} <a href={hrefLink}>{hrefLinkText}</a></p>
        </form>
    )
}

export default Form