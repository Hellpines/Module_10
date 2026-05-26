import { User } from '../types/auth/User';

export const getAvatarPath = (currentUser: User | null) => {
    const img = currentUser?.profileImage;
    if (!img) {
        return '';
    } else if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) {
        return img;
    }

    let base = process.env.PUBLIC_URL || '';
    if (base && !base.endsWith('/')) {
        base += '/';
    } else if (!base) {
        base = '/';
    }

    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${base}${cleanImg}`;
};
