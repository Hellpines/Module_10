import { NavLink } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './noauthpage.module.css';

function NoAuthPage() {
    return (
        <div className={style.page}>
            <Header pageStatus='NotAuthorized'/>
            <main className={style.main}>
                <h1>You need to <NavLink to='/signin'>sign in</NavLink> to be able to create notes.</h1>
                <p>Still don’t have an account? <NavLink to='/signup'>Sign up</NavLink></p>
            </main>
            <Footer/>
        </div>
    )
}

export default NoAuthPage