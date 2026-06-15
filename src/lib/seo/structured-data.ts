import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl, toAbsoluteUrl } from './site';

type JsonLd = Record<string, unknown>;

export function getWebSiteJsonLd(): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: getSiteUrl(),
        inLanguage: 'en-US',
    };
}

export function getWebApplicationJsonLd(): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: getSiteUrl(),
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        browserRequirements: 'Requires JavaScript',
    };
}

export function getBreadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: toAbsoluteUrl(item.path),
        })),
    };
}

export function getCollectionPageJsonLd({
    name,
    description,
    path,
}: {
    name: string;
    description: string;
    path: string;
}): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url: toAbsoluteUrl(path),
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: getSiteUrl(),
        },
    };
}

export function getProfilePageJsonLd(): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'Profile',
        description: 'Manage your account settings, statistics, and note preferences',
        url: toAbsoluteUrl('/profile'),
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: getSiteUrl(),
        },
    };
}

export function getLoginPageJsonLd(): JsonLd {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Sign In',
        description: 'Sign in to access your notes',
        url: toAbsoluteUrl('/signin'),
    };
}
