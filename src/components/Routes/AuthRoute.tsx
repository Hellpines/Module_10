'use client';

import { AuthRouteProps } from '../../types/props/AuthRouteProps';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/PageViews/PageLoader';
import { toCanonicalPath } from '@/lib/seo/site';

export default function AuthRoute({ children, requireAuth, redirectTo }: AuthRouteProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const isAuthenticated = !!currentUser;
    const shouldRedirect = (requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated);
    const targetPath = toCanonicalPath(redirectTo);

    useEffect(() => {
        if (shouldRedirect) {
            router.replace(targetPath);
        }
    }, [shouldRedirect, targetPath, router]);

    if (shouldRedirect) {
        return <PageLoader />;
    }

    return <>{children}</>;
}
