import { NavLink } from 'react-router-dom';
import style from './noauthpage.module.css';
import Layout from '../../components/Layout/Layout';

function NoAuthPage() {
    return (
        <Layout pageStatus='NotAuthorized'>
            <main className={style.main}>
                <h1>You need to <NavLink to='/signin'>sign in</NavLink> to be able to create notes.</h1>
                <p>Still don’t have an account? <NavLink to='/signup'>Sign up</NavLink></p>
            </main>
        </Layout>
    )
}

export default NoAuthPage