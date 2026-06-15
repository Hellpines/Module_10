'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/lib/navigation/app-routes';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import style from './sign.module.css';
import Form from '../../components/Form/Form';
import Layout from '../../components/Layout/Layout';
import { SignFormData } from '../../types/auth/SignFormData';
import { useNotification } from '../../hooks/useNotification';

function SignIn() {
    const { t } = useTranslation();

    const { login } = useAuth();
    const { showNotifications } = useNotification();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignFormData>();

    const submitForm = async (data: SignFormData) => {
        const user = await login(data.email, data.password);

        if (!user) {
            showNotifications(t('signin.wrongCredentials'), 'error');
            return;
        }

        router.replace(APP_ROUTES.home);
        showNotifications(
            t('signin.welcomeMessage', { name: user.firstName || user.username }),
            'success'
        );
    };

    return (
        <Layout pageStatus='NotAuthorized'>
            <main className={style.main}>
                <div role='region' aria-label={t('signin.legendTitle')}>
                    <Form
                        legendTitle={t('signin.legendTitle')}
                        legendSubTitle={t('signin.legendSubTitle')}
                        submitButtonTitle={t('signin.submitButtonTitle')}
                        redirectText={t('signin.redirectText')}
                        hrefLink='/signup'
                        hrefLinkText={t('signin.hrefLinkText')}
                        handleSubmit={handleSubmit}
                        onSubmit={submitForm}
                        register={register}
                        errors={errors}
                        email={watch('email') || ''}
                        password={watch('password') || ''}
                    />
                </div>
            </main>
        </Layout>
    );
}

export default SignIn;
