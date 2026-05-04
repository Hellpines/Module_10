import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './notfound.module.css'
import notfound from '../../assets/images/notfound.svg'

function NotFound() {
    return (
        <div>
            <Header pageType='Error' />
            <main className={style.main}>
                <img src={notfound} alt='notfound-icon' />
                <p>Page not found</p>
            </main>
            <Footer/>
        </div>
    );
}

export default NotFound