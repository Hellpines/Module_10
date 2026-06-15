import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = createPageMetadata({
    title: 'Trash',
    description: 'View deleted notes, move them to the archive, or delete them forever',
    path: '/trash',
    noIndex: true,
});

export default function TrashLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        getCollectionPageJsonLd({
            name: 'Trash',
            description: 'View deleted notes, move them to the archive, or delete them forever',
            path: '/trash',
        }),
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Trash', path: '/trash' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
