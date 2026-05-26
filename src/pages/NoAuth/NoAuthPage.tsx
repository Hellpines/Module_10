import { NavLink } from 'react-router-dom';
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
                    <NavLink to='/signin'>{t('noAuthPage.signInLink')}</NavLink>
                    {t('noAuthPage.signInRequiredPart2')}
                </h1>
                <p>
                    {t('noAuthPage.signUpPrompt')}{' '}
                    <NavLink to='/signup'>{t('noAuthPage.signUpLink')}</NavLink>
                </p>
            </main>
        </Layout>
    );
}

export default NoAuthPage;
