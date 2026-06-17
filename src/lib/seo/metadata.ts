import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, getMetadataBase, toCanonicalPath } from './site';
import { PageSeoConfig } from '@/types/seo/PageSeoConfig';

export function createPageMetadata({
    title,
    description = SITE_DESCRIPTION,
    path,
    noIndex = false,
    ogType = 'website',
}: PageSeoConfig): Metadata {
    const canonical = toCanonicalPath(path);

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            type: ogType,
            url: canonical,
            siteName: SITE_NAME,
        },
        twitter: {
            card: 'summary',
            title: `${title} | ${SITE_NAME}`,
            description,
        },
        robots: noIndex
            ? {
                  index: false,
                  follow: false,
              }
            : {
                  index: true,
                  follow: true,
              },
    };
}

export function createRootMetadata(): Metadata {
    return {
        metadataBase: getMetadataBase(),
        title: {
            default: `${SITE_NAME} | Personal Note Dashboard`,
            template: `%s | ${SITE_NAME}`,
        },
        description: SITE_DESCRIPTION,
        applicationName: SITE_NAME,
        keywords: ['notes', 'note dashboard', 'archive', 'checklist'],
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        alternates: {
            canonical: '/',
        },
        openGraph: {
            title: `${SITE_NAME} | Personal Note Dashboard`,
            description: SITE_DESCRIPTION,
            type: 'website',
            url: '/',
            siteName: SITE_NAME,
            locale: 'en_US',
        },
        twitter: {
            card: 'summary',
            title: `${SITE_NAME} | Personal Note Dashboard`,
            description: SITE_DESCRIPTION,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
