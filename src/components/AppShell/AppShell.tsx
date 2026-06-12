'use client';

import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Notification from '@/components/Notification/Notification';
import { Loader } from '@/components/UI/Loader/Loader';
import { useAuth } from '@/hooks/useAuth';

export function AppShell({ children }: { children: ReactNode }) {
    const { isAuthLoading } = useAuth();
    const { t } = useTranslation();

    if (isAuthLoading) {
        return <Loader label={t('app.loading')} />;
    }

    return (
        <>
            <Notification />
            <Suspense fallback={<Loader label={t('app.pageLoading')} />}>{children}</Suspense>
        </>
    );
}
