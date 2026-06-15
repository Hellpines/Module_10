'use client';

import { useTranslation } from 'react-i18next';
import { Loader } from '@/components/UI/Loader/Loader';

export function PageLoader() {
    const { t } = useTranslation();

    return <Loader label={t('app.pageLoading')} />;
}
