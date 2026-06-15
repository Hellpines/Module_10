'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import { AppShell } from '@/components/AppShell/AppShell';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import PublicRoute from '@/components/Routes/PublicRoute';
import { PageLoader } from '@/components/PageViews/PageLoader';
import { RouteGuard } from '@/types/route/RouteGuard';

export function createLazyView<P extends object>(
    importView: () => Promise<{ default: ComponentType<P> }>,
    displayName: string
) {
    const LazyView = dynamic(importView, {
        loading: () => <PageLoader />,
        ssr: false,
    });

    LazyView.displayName = displayName;

    return LazyView;
}

export function createAppPageView<P extends object>(
    importView: () => Promise<{ default: ComponentType<P> }>,
    displayName: string,
    guard: RouteGuard = 'none'
) {
    const LazyView = createLazyView(importView, displayName);

    function AppPageView(props: P) {
        let content: ReactNode = <LazyView {...props} />;

        if (guard === 'protected') {
            content = <ProtectedRoute>{content}</ProtectedRoute>;
        }

        if (guard === 'public') {
            content = <PublicRoute>{content}</PublicRoute>;
        }

        return <AppShell>{content}</AppShell>;
    }

    AppPageView.displayName = `${displayName}Page`;

    return AppPageView;
}
