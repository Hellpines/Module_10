import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getLoginPageJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = createPageMetadata({
    title: 'Sign In',
    description: 'Sign in to your notes account to access and manage your personal notes',
    path: '/signin',
    noIndex: true,
});

export default function SignInLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        getLoginPageJsonLd(),
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Sign In', path: '/signin' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
