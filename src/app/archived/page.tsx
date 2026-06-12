'use client';

import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const Archived = dynamic(() => import('@/views/Archived/Archived'), { ssr: false });

export default function ArchivedPage() {
    return (
        <AppShell>
            <ProtectedRoute>
                <Archived />
            </ProtectedRoute>
        </AppShell>
    );
}
