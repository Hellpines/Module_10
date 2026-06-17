export function getGraphqlUrl(): string {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

    return `${basePath}/api/graphql`;
}
