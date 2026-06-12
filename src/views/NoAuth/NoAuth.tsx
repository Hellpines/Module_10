'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import style from '../infoPage.module.css';
import Layout from '../../components/Layout/Layout';

function NoAuthPage() {
    const { t } = useTranslation();

    return (
        <Layout pageStatus='NotAuthorized'>
            <main className={style.noAuthPage}>
                <h1>
                    {t('noAuthPage.signInRequiredPart1')}
                    <Link href='/signin'>{t('noAuthPage.signInLink')}</Link>
                    {t('noAuthPage.signInRequiredPart2')}
                </h1>
                <p>
                    {t('noAuthPage.signUpPrompt')}{' '}
                    <Link href='/signup'>{t('noAuthPage.signUpLink')}</Link>
                </p>
            </main>
        </Layout>
    );
}

export default NoAuthPage;
