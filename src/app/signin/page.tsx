'use client';

import dynamic from 'next/dynamic';
import PublicRoute from '@/components/Routes/PublicRoute';
import { AppShell } from '@/components/AppShell/AppShell';

const SignIn = dynamic(() => import('@/views/Sign/SignIn'), { ssr: false });

export default function SignInPage() {
    return (
        <AppShell>
            <PublicRoute>
                <SignIn />
            </PublicRoute>
        </AppShell>
    );
}
