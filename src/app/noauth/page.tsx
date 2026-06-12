'use client';

import dynamic from 'next/dynamic';
import PublicRoute from '@/components/Routes/PublicRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const NoAuth = dynamic(() => import('@/views/NoAuth/NoAuth'), { ssr: false });

export default function NoAuthPage() {
    return (
        <AppShell>
            <PublicRoute>
                <NoAuth />
            </PublicRoute>
        </AppShell>
    );
}
