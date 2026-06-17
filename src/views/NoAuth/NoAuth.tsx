'use client';

import { useTranslation } from 'react-i18next';
import { AppLink } from '@/components/Navigation/AppLink';
import { APP_ROUTES } from '@/lib/navigation/app-routes';
import style from '../infoPage.module.css';
import Layout from '../../components/Layout/Layout';

function NoAuthPage() {
    const { t } = useTranslation();

    return (
        <Layout pageStatus='NotAuthorized'>
            <main className={style.noAuthPage}>
                <h1>
                    {t('noAuthPage.signInRequiredPart1')}
                    <AppLink href={APP_ROUTES.signIn}>{t('noAuthPage.signInLink')}</AppLink>
                    {t('noAuthPage.signInRequiredPart2')}
                </h1>
                <p>
                    {t('noAuthPage.signUpPrompt')}{' '}
                    <AppLink href={APP_ROUTES.signUp}>{t('noAuthPage.signUpLink')}</AppLink>
                </p>
            </main>
        </Layout>
    );
}

export default NoAuthPage;
