'use client';

import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const Notes = dynamic(() => import('@/views/Notes/Notes'), { ssr: false });

export default function HomePage() {
    return (
        <AppShell>
            <ProtectedRoute>
                <Notes />
            </ProtectedRoute>
        </AppShell>
    );
}
