'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/lib/navigation/app-routes';
import { toCanonicalPath } from '@/lib/seo/site';
import style from './sign.module.css';
import Form from '../../components/Form/Form';
import Layout from '../../components/Layout/Layout';
import { SignFormData } from '../../types/auth/SignFormData';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

function SignUp() {
    const { t } = useTranslation();

    const { signUp } = useAuth();
    const { showNotifications } = useNotification();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignFormData>();

    const submitForm = async (data: SignFormData) => {
        const success = await signUp(data.email, data.password);

        if (!success) {
            showNotifications(t('signup.userExistsError'), 'error');
            return;
        }

        router.replace(toCanonicalPath(APP_ROUTES.signIn));
        showNotifications(t('signup.successMessage'), 'success');
    };

    return (
        <Layout pageStatus='NotAuthorized'>
            <main className={style.main}>
                <div role='region' aria-label={t('signup.legendTitle')}>
                    <Form
                        legendTitle={t('signup.legendTitle')}
                        legendSubTitle={t('signup.legendSubTitle')}
                        submitButtonTitle={t('signup.submitButtonTitle')}
                        isSignUp
                        redirectText={t('signup.redirectText')}
                        hrefLink='/signin'
                        hrefLinkText={t('signup.hrefLinkText')}
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

export default SignUp;
