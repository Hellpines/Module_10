'use client';

import type { ComponentType, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/Routes/ProtectedRoute';
import PublicRoute from '@/components/Routes/PublicRoute';
import { PageLoader } from '@/components/PageViews/PageLoader';
import { RouteGuard } from '@/types/route/RouteGuard';

interface LazyViewOptions {
    eager?: boolean;
}

export function createLazyView<P extends object>(
    importView: () => Promise<{ default: ComponentType<P> }>,
    displayName: string,
    options: LazyViewOptions = {}
) {
    const LazyView = options.eager
        ? dynamic(importView, { ssr: false })
        : dynamic(importView, {
              loading: () => <PageLoader />,
              ssr: false,
          });

    LazyView.displayName = displayName;

    return LazyView;
}

export function createAppPageView<P extends object>(
    importView: () => Promise<{ default: ComponentType<P> }>,
    displayName: string,
    guard: RouteGuard = 'none',
    options: LazyViewOptions = {}
) {
    const LazyView = createLazyView(importView, displayName, options);

    function AppPageView(props: P) {
        let content: ReactNode = <LazyView {...props} />;

        if (guard === 'protected') {
            content = <ProtectedRoute>{content}</ProtectedRoute>;
        }

        if (guard === 'public') {
            content = <PublicRoute>{content}</PublicRoute>;
        }

        return content;
    }

    AppPageView.displayName = `${displayName}Page`;

    return AppPageView;
}
