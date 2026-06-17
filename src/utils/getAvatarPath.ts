import { User } from '../types/auth/User';

export const getAvatarPath = (currentUser: User | null): string | undefined => {
    const img = currentUser?.profileImage;
    if (!img) {
        return undefined;
    }

    if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) {
        return img;
    }

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.PUBLIC_URL ?? '';
    let normalizedBase = base;

    if (normalizedBase && !normalizedBase.endsWith('/')) {
        normalizedBase += '/';
    } else if (!normalizedBase) {
        normalizedBase = '/';
    }

    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${normalizedBase}${cleanImg}`;
};
