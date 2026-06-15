'use client';

import { AuthRouteProps } from '../../types/props/AuthRouteProps';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/PageViews/PageLoader';

export default function AuthRoute({ children, requireAuth, redirectTo }: AuthRouteProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const isAuthenticated = !!currentUser;

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.replace(redirectTo);
        }
        if (!requireAuth && isAuthenticated) {
            router.replace(redirectTo);
        }
    }, [requireAuth, isAuthenticated, redirectTo, router]);

    if (requireAuth && !isAuthenticated) return <PageLoader />;
    if (!requireAuth && isAuthenticated) return <PageLoader />;

    return <>{children}</>;
}
