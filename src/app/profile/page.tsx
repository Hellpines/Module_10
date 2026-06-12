'use client';

import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const Profile = dynamic(() => import('@/views/Profile/Profile'), { ssr: false });

export default function ProfilePage() {
    return (
        <AppShell>
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        </AppShell>
    );
}
