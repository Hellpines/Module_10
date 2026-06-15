import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/structured-data';
import { toAbsoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = createPageMetadata({
    title: 'Authentication Required',
    description: 'Sign in to access protected notes pages and manage your notes',
    path: '/noauth',
    noIndex: true,
});

export default function NoAuthLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Authentication Required',
            description: 'Sign in to access protected notes pages and manage your notes',
            url: toAbsoluteUrl('/noauth'),
        },
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Authentication Required', path: '/noauth' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
