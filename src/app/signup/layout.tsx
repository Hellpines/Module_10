import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/structured-data';
import { toAbsoluteUrl } from '@/lib/seo/site';

export const metadata: Metadata = createPageMetadata({
    title: 'Sign Up',
    description: 'Create a Notes account and start organizing your personal notes',
    path: '/signup',
    noIndex: true,
});

export default function SignUpLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sign Up',
            description: 'Create a notes account and start organizing your personal notes',
            url: toAbsoluteUrl('/signup'),
        },
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Sign Up', path: '/signup' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
