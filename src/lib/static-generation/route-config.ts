export const STATIC_PAGE_REVALIDATE_SECONDS = 360;

export const ROUTE_DYNAMIC = 'force-static' as const;

export function getRouteRevalidate(): number | false {
    return process.env.GITHUB_PAGES === 'true' ? false : STATIC_PAGE_REVALIDATE_SECONDS;
}
