import {
    getMetadataBase,
    getSiteUrl,
    toAbsoluteUrl,
    toCanonicalPath,
    usesTrailingSlash,
} from '@/lib/seo/site';

describe('seo site helpers', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.NEXT_PUBLIC_SITE_URL;
        delete process.env.NEXT_PUBLIC_BASE_PATH;
        delete process.env.GITHUB_PAGES;
        delete process.env.NEXT_PUBLIC_TRAILING_SLASH;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('builds metadata base from default origin', () => {
        expect(getSiteUrl()).toBe('https://hellpines.github.io');
        expect(getMetadataBase().toString()).toBe('https://hellpines.github.io/');
    });

    test('uses base path for github pages deployment', () => {
        process.env.NEXT_PUBLIC_BASE_PATH = '/Module_10';

        expect(getSiteUrl()).toBe('https://hellpines.github.io/Module_10');
        expect(getMetadataBase().toString()).toBe('https://hellpines.github.io/Module_10/');
    });

    test('respects custom site url and base path', () => {
        process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
        process.env.NEXT_PUBLIC_BASE_PATH = '/app';

        expect(getSiteUrl()).toBe('https://example.com/app');
        expect(toAbsoluteUrl('/profile')).toBe('https://example.com/app/profile');
    });

    test('adds trailing slash to canonical paths when enabled', () => {
        process.env.NEXT_PUBLIC_TRAILING_SLASH = 'true';

        expect(usesTrailingSlash()).toBe(true);
        expect(toCanonicalPath('/profile')).toBe('/profile/');
        expect(toCanonicalPath('/')).toBe('/');
    });
});
