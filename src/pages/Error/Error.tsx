import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './error.module.css';
import { ReactComponent as ErrorIcon } from '../../assets/icons/error-icon.svg';

function Error() {
    return (
        <div className={style.page}>
            <Header pageStatus='Error' />
            <main className={style.main}>
                <ErrorIcon className={style.errorIcon}/>
                <p>Oops...<br></br>Something bad has just happened</p>
            </main>
            <Footer/>
        </div>
    );
}

export default Error