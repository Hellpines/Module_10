'use client';

import dynamic from 'next/dynamic';
import { AppShell } from '@/components/AppShell/AppShell';

const NotFound = dynamic(() => import('@/views/NotFound/NotFound'), { ssr: false });

export default function NotFoundPage() {
    return (
        <AppShell>
            <NotFound />
        </AppShell>
    );
}
