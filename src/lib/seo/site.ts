export const SITE_NAME = 'Notes';

export const SITE_DESCRIPTION =
    'Organize, archive, and manage your personal notes in one secure workspace';

const DEFAULT_SITE_ORIGIN = 'https://hellpines.github.io';

export function usesTrailingSlash(): boolean {
    return process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_TRAILING_SLASH === 'true';
}

export function getSiteOrigin(): string {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_ORIGIN).replace(/\/$/, '');
}

export function getSiteUrl(): string {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    return `${getSiteOrigin()}${basePath}`;
}

export function getMetadataBase(): URL {
    return new URL(`${getSiteUrl()}/`);
}

export function toCanonicalPath(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;

    if (normalized === '/') {
        return usesTrailingSlash() ? '/' : '/';
    }

    if (usesTrailingSlash() && !normalized.endsWith('/')) {
        return `${normalized}/`;
    }

    if (!usesTrailingSlash() && normalized.endsWith('/') && normalized.length > 1) {
        return normalized.slice(0, -1);
    }

    return normalized;
}

export function toAbsoluteUrl(path: string): string {
    const canonicalPath = toCanonicalPath(path);
    const siteUrl = getSiteUrl().replace(/\/$/, '');
    return canonicalPath === '/' ? `${siteUrl}/` : `${siteUrl}${canonicalPath}`;
}
