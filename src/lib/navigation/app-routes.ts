export const APP_ROUTES = {
    home: '/',
    profile: '/profile',
    archived: '/archived',
    trash: '/trash',
    signIn: '/signin',
    signUp: '/signup',
    noAuth: '/noauth',
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const AUTHORIZED_APP_ROUTES: AppRoute[] = [
    APP_ROUTES.home,
    APP_ROUTES.profile,
    APP_ROUTES.archived,
    APP_ROUTES.trash,
];

export const PUBLIC_APP_ROUTES: AppRoute[] = [APP_ROUTES.signIn, APP_ROUTES.signUp];

export const AUTH_FLOW_ROUTES: AppRoute[] = [...PUBLIC_APP_ROUTES, APP_ROUTES.noAuth];

export function isActiveRoute(pathname: string, href: AppRoute): boolean {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');

    return normalizedPath === normalizedHref;
}
