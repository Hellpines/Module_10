export function getMswBasePath(): string {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

    if (basePath && basePath !== '/') {
        return basePath.replace(/^\//, '');
    }

    return process.env.NODE_ENV === 'production' ? 'Module_10' : '.';
}
