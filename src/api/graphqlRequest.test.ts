import axios from 'axios';
import { graphqlRequest } from './graphqlRequest';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('graphqlRequest Utility', () => {
    const sampleQuery = 'query GetUser { user { id name } }';
    const sampleVariables = { id: '123' };
    const sampleToken = 'mock-jwt-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    test('returns payload data successfully on a valid graphQL response without authorization token', async () => {
        const mockResponse = {
            data: {
                data: { user: { id: '123', name: 'John Doe' } },
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        const result = await graphqlRequest<{ user: { id: string; name: string } }>(
            sampleQuery,
            sampleVariables
        );

        expect(result).toEqual(mockResponse.data.data);
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/graphql',
            { query: sampleQuery, variables: sampleVariables },
            expect.objectContaining({
                headers: {},
                validateStatus: expect.any(Function),
            })
        );
    });

    test('attaches Bearer authentication token to headers when provided', async () => {
        const mockResponse = { data: { data: { success: true } } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        await graphqlRequest(sampleQuery, sampleVariables, sampleToken);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/graphql',
            expect.any(Object),
            expect.objectContaining({
                headers: {
                    Authorization: `Bearer ${sampleToken}`,
                },
            })
        );
    });

    test('defaults variables parameter to empty object when omitted from execution signature', async () => {
        const mockResponse = { data: { data: { success: true } } };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        await graphqlRequest(sampleQuery);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/graphql',
            { query: sampleQuery, variables: {} },
            expect.any(Object)
        );
    });

    test('throws structured exception error message when server responds with internal GraphQL errors array', async () => {
        const mockResponse = {
            data: {
                errors: [{ message: 'User is not authorized to access this resource' }],
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        await expect(graphqlRequest(sampleQuery, sampleVariables)).rejects.toThrow(
            'User is not authorized to access this resource'
        );

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('GraphQL Errors:', mockResponse.data.errors);
    });

    test('falls back to default error description string if GraphQL error array items lack message details', async () => {
        const mockResponse = {
            data: {
                errors: [{ extensions: { code: 'INTERNAL_SERVER_ERROR' } }],
            },
        };
        mockedAxios.post.mockResolvedValueOnce(mockResponse);

        await expect(graphqlRequest(sampleQuery, sampleVariables)).rejects.toThrow('GraphQL Error');
    });

    test('evaluates valid network HTTP status criteria rule parameters correctly', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: {} } });

        await graphqlRequest(sampleQuery);

        const { validateStatus } = mockedAxios.post.mock.calls[0][2]!;

        expect(validateStatus!(200)).toBe(true);
        expect(validateStatus!(404)).toBe(true);
        expect(validateStatus!(500)).toBe(false);
        expect(validateStatus!(199)).toBe(false);
    });
});
