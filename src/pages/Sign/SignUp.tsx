import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './sign.module.css';
import Form from '../../components/Form/Form';
import Layout from '../../components/Layout/Layout';
import { AuthContext } from '../../context/AuthContext';


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
        <Layout pageStatus='NotAuthorized'>
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
        </Layout>
    )
}

export default SignUp