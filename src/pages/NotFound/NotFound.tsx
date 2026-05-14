import style from './notfound.module.css';
import Layout from '../../components/Layout/Layout';
import { ReactComponent as NotFoundIcon } from '../../assets/images/notfound.svg';

function NotFound() {
    return (
        <Layout pageStatus='Error'>
            <main className={style.main}>
                <NotFoundIcon className={style.notFoundIcon} />
                <p>Page not found</p>
            </main>
        </Layout>
    );
}

export default NotFound