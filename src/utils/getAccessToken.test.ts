import { getAccessToken } from './getAccessToken';

describe('getAccessToken utility', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(Storage.prototype, 'getItem');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should return token if it exists in localStorage', () => {
        localStorage.setItem('access_token', 'test-token');

        expect(getAccessToken()).toBe('test-token');
        expect(Storage.prototype.getItem).toHaveBeenCalledWith('access_token');
    });

    test('should return null if token does not exist in localStorage', () => {
        expect(getAccessToken()).toBeNull();
        expect(Storage.prototype.getItem).toHaveBeenCalledWith('access_token');
    });
});
