'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AUTHORIZED_APP_ROUTES, PUBLIC_APP_ROUTES } from '@/lib/navigation/app-routes';

export function RoutePrefetcher() {
    const router = useRouter();
    const { currentUser } = useAuth();

    useEffect(() => {
        const routes = currentUser ? AUTHORIZED_APP_ROUTES : PUBLIC_APP_ROUTES;

        routes.forEach((route) => {
            router.prefetch(route);
        });
    }, [currentUser, router]);

    return null;
}
