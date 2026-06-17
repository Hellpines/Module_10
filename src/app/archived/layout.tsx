import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = createPageMetadata({
    title: 'Archived Notes',
    description: 'Show archived notes and move them to active status',
    path: '/archived',
});

export default function ArchivedLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        getCollectionPageJsonLd({
            name: 'Archived Notes',
            description: 'Show archived notes and move them to active status',
            path: '/archived',
        }),
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Archived Notes', path: '/archived' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
