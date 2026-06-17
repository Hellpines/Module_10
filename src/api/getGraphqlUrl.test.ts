import { getGraphqlUrl } from './getGraphqlUrl';

describe('getGraphqlUrl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('returns root graphql path in local development', () => {
        expect(getGraphqlUrl()).toBe('/api/graphql');
    });

    test('includes base path for github pages deployment', () => {
        process.env.NEXT_PUBLIC_BASE_PATH = '/Module_10';

        expect(getGraphqlUrl()).toBe('/Module_10/api/graphql');
    });
});
