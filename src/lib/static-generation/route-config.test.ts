import { APP_ROUTES, isActiveRoute } from '@/lib/navigation/app-routes';
import {
    ROUTE_DYNAMIC,
    STATIC_PAGE_REVALIDATE_SECONDS,
    getRouteRevalidate,
} from '@/lib/static-generation/route-config';

describe('route static generation config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.GITHUB_PAGES;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('documents static rendering mode for app routes', () => {
        expect(ROUTE_DYNAMIC).toBe('force-static');
    });

    test('uses ISR revalidation outside github pages export', () => {
        expect(getRouteRevalidate()).toBe(STATIC_PAGE_REVALIDATE_SECONDS);
    });

    test('disables revalidation for github pages static export', () => {
        process.env.GITHUB_PAGES = 'true';

        expect(getRouteRevalidate()).toBe(false);
    });
});

describe('app route helpers', () => {
    test('matches active routes with and without trailing slash', () => {
        expect(isActiveRoute('/', APP_ROUTES.home)).toBe(true);
        expect(isActiveRoute('/profile/', APP_ROUTES.profile)).toBe(true);
        expect(isActiveRoute('/profile', APP_ROUTES.trash)).toBe(false);
    });
});
