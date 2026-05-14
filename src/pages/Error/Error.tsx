import style from './error.module.css';
import { ReactComponent as ErrorIcon } from '../../assets/icons/error-icon.svg';
import Layout from '../../components/Layout/Layout';

function Error() {
    return (
        <Layout pageStatus='Error'>
            <main className={style.main}>
                <ErrorIcon className={style.errorIcon} />
                <p>Oops...<br></br>Something bad has just happened</p>
            </main>
        </Layout>
    );
}

export default Error