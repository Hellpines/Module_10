import { getAvatarPath } from './getAvatarPath';
import { User } from '../types/auth/User';

describe('getAvatarPath utility', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('should return undefined if currentUser is null', () => {
        expect(getAvatarPath(null)).toBeUndefined();
    });

    test('should return undefined if profileImage is not provided', () => {
        const mockUser = {} as User;
        expect(getAvatarPath(mockUser)).toBeUndefined();
    });

    test('should return unchanged string if it starts with http, blob:, or data:', () => {
        expect(getAvatarPath({ profileImage: 'http://example.com/avatar.jpg' } as User)).toBe(
            'http://example.com/avatar.jpg'
        );
        expect(getAvatarPath({ profileImage: 'blob:http://localhost:3000/uuid' } as User)).toBe(
            'blob:http://localhost:3000/uuid'
        );
        expect(getAvatarPath({ profileImage: 'data:image/png;base64,xyz' } as User)).toBe(
            'data:image/png;base64,xyz'
        );
    });

    test('should append trailing slash to PUBLIC_URL if it is missing', () => {
        process.env.PUBLIC_URL = 'https://cdn.example.com';
        const mockUser = { profileImage: 'uploads/avatar.jpg' } as User;

        expect(getAvatarPath(mockUser)).toBe('https://cdn.example.com/uploads/avatar.jpg');
    });

    test('should not append extra trailing slash if PUBLIC_URL already ends with a slash', () => {
        process.env.PUBLIC_URL = 'https://cdn.example.com/';
        const mockUser = { profileImage: 'uploads/avatar.jpg' } as User;

        expect(getAvatarPath(mockUser)).toBe('https://cdn.example.com/uploads/avatar.jpg');
    });

    test('should default to a leading slash if PUBLIC_URL is empty', () => {
        process.env.PUBLIC_URL = '';
        const mockUser = { profileImage: 'uploads/avatar.jpg' } as User;

        expect(getAvatarPath(mockUser)).toBe('/uploads/avatar.jpg');
    });

    test('should strip leading slash from image path to prevent duplicate slashes', () => {
        process.env.PUBLIC_URL = 'https://cdn.example.com';
        const mockUser = { profileImage: '/uploads/avatar.jpg' } as User;

        expect(getAvatarPath(mockUser)).toBe('https://cdn.example.com/uploads/avatar.jpg');
    });
});
