import Form from '../../components/Form/Form';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './sign.module.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signUp } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const submitForm = () => {
        const success = signUp(email, password);

        if (!success) {
            alert('User already exists');
            return;
        }

        navigate('/signin');
    };

    return (
        <div className={style.page}>
            <Header/>
            <main className={style.main}>
                <Form 
                    legendTitle='Create an account' 
                    legendSubTitle='Enter your email and password to sign up for this app' 
                    submitButtonTitle='Sign Up' 
                    isSignUp 
                    redirectText='Already have an account?' 
                    hrefLink='/signin' 
                    hrefLinkText='Sign In' 
                    submitForm={submitForm}
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                />
            </main>
            <Footer/>
        </div>
    )
}

export default SignUp