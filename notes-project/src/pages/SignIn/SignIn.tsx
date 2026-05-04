import Form from '../../components/Form/Form'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import style from './signin.module.css'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const submitForm = () => {
        if (!email || !password) {
            alert('Fill all fields');
            return;
        }
        
        const user = signIn(email, password);

        if (!user) {
            alert('Wrong credentials');
            return;
        }

        navigate('/');
    };

    return (
        <div>
            <Header/>
            <main className={style.main}>
                <Form 
                    legendTitle='Sign in into an account' 
                    legendSubTitle='Enter your email and password to sign in into this app' 
                    submitButtonTitle='Sign In' 
                    redirectText='Forgot to create an account?' 
                    hrefLink='/signup' 
                    hrefLinkText='Sign Up' 
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

export default SignIn