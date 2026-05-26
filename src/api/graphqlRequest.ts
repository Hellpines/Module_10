import axios from 'axios';

export const graphqlRequest = async <T>(
    query: string,
    variables = {},
    token?: string | null
): Promise<T> => {
    const response = await axios.post(
        '/api/graphql',
        {
            query,
            variables,
        },
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            validateStatus: (status) => status >= 200 && status < 500,
        }
    );

    if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        throw new Error(response.data.errors[0].message || 'GraphQL Error');
    }

    return response.data.data;
};
