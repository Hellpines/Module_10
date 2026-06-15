import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StructuredData } from '@/components/Seo/StructuredData';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getProfilePageJsonLd } from '@/lib/seo/structured-data';

export const metadata: Metadata = createPageMetadata({
    title: 'Profile',
    description:
        'Manage your profile, theme, language, font size, note statistics, and background settings',
    path: '/profile',
    ogType: 'profile',
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
    const structuredData = [
        getProfilePageJsonLd(),
        getBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Profile', path: '/profile' },
        ]),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            {children}
        </>
    );
}
