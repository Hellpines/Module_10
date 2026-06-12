'use client';

import { useTranslation } from 'react-i18next';
import style from '../infoPage.module.css';
import { ReactComponent as ErrorIcon } from '../../assets/icons/error-icon.svg';
import Layout from '../../components/Layout/Layout';

function Error() {
    const { t } = useTranslation();

    return (
        <Layout pageStatus='Error'>
            <main className={style.statusPage}>
                <ErrorIcon className={style.icon} aria-hidden='true' />
                <h1 className={style.title}>
                    <span>{t('error.oops')}</span>
                    <br />
                    <span>{t('error.message')}</span>
                </h1>
            </main>
        </Layout>
    );
}

export default Error;
