import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './notfound.module.css';
import { ReactComponent as NotFoundIcon } from '../../assets/images/notfound.svg';

function NotFound() {
    return (
        <div className={style.page}>
            <Header pageStatus='Error' />
            <main className={style.main}>
                <NotFoundIcon className={style.notFoundIcon}/>
                <p>Page not found</p>
            </main>
            <Footer/>
        </div>
    );
}

export default NotFound