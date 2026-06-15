import type { Metadata } from 'next';
import { StructuredData } from '@/components/Seo/StructuredData';
import { AppShell } from '@/components/AppShell/AppShell';
import { inter, poppins } from '@/lib/fonts';
import { createPageMetadata, createRootMetadata } from '@/lib/seo/metadata';
import {
    getBreadcrumbJsonLd,
    getCollectionPageJsonLd,
    getWebApplicationJsonLd,
    getWebSiteJsonLd,
} from '@/lib/seo/structured-data';
import { Providers } from './providers';
import './globals.css';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
    ...createRootMetadata(),
    ...createPageMetadata({
        title: 'My Notes',
        description:
            'Create, edit, archive, delete and organize your personal notes with checklists and custom backgrounds',
        path: '/',
    }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const structuredData = [
        getWebSiteJsonLd(),
        getWebApplicationJsonLd(),
        getCollectionPageJsonLd({
            name: 'My Notes',
            description:
                'Create, edit, archive, delete and organize your personal notes with checklists and custom backgrounds',
            path: '/',
        }),
        getBreadcrumbJsonLd([{ name: 'Home', path: '/' }]),
    ];

    return (
        <html lang='en' className={`${poppins.variable} ${inter.variable}`}>
            <body>
                <StructuredData data={structuredData} />
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
}
