'use client';

import { useTranslation } from 'react-i18next';
import style from '../infoPage.module.css';
import Layout from '../../components/Layout/Layout';
import { ReactComponent as NotFoundIcon } from '../../assets/images/notfound.svg';

function NotFound() {
    const { t } = useTranslation();

    return (
        <Layout pageStatus='Error'>
            <main className={style.statusPage}>
                <NotFoundIcon className={style.icon} aria-hidden='true' />
                <h1 className={style.title}>{t('notFound.message')}</h1>
            </main>
        </Layout>
    );
}

export default NotFound;
