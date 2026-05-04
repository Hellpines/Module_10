import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import style from './error.module.css'
import errorIcon from '../../assets/icons/error-icon.svg'

function Error() {
    return (
        <div>
            <Header pageType='Error' />
            <main className={style.main}>
                <img src={errorIcon} alt='error-icon' />
                <p>Oops...<br></br>Something bad has just happened</p>
            </main>
            <Footer/>
        </div>
    );
}

export default Error