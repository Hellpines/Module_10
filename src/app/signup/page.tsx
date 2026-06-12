'use client';

import dynamic from 'next/dynamic';
import PublicRoute from '@/components/Routes/PublicRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const SignUp = dynamic(() => import('@/views/Sign/SignUp'), { ssr: false });

export default function SignInPage() {
    return (
        <AppShell>
            <PublicRoute>
                <SignUp />
            </PublicRoute>
        </AppShell>
    );
}
