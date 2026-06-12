import axios from 'axios';
import { NoteStatus } from '../types/notes/NoteStatus';
import { getAccessToken } from './getAccessToken';

export const fetchNotesByStatus = async (status: NoteStatus) => {
    const token = getAccessToken();

    const response = await axios.get(`/api/todos?status=${status}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
