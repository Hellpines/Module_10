'use client';

import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const Trash = dynamic(() => import('@/views/Trash/Trash'), { ssr: false });

export default function TrashPage() {
    return (
        <AppShell>
            <ProtectedRoute>
                <Trash />
            </ProtectedRoute>
        </AppShell>
    );
}
