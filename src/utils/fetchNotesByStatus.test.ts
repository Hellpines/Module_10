import axios from 'axios';
import { fetchNotesByStatus } from './fetchNotesByStatus';
import { NoteStatus } from '../types/notes/NoteStatus';

jest.mock('axios');
jest.mock('./getAccessToken', () => ({
    getAccessToken: jest.fn(() => 'mock-token'),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchNotesByStatus utility', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch data successfully with correct URL and headers', async () => {
        const mockData = [{ id: '1', title: 'Test Note' }];
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        const status = 'active' as NoteStatus;
        const result = await fetchNotesByStatus(status);

        expect(mockedAxios.get).toHaveBeenCalledWith('/api/todos?status=active', {
            headers: {
                Authorization: 'Bearer mock-token',
            },
        });
        expect(result).toEqual(mockData);
    });

    test('should throw an error when the API call fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        const status = 'active' as NoteStatus;

        await expect(fetchNotesByStatus(status)).rejects.toThrow('Network Error');
    });
});
