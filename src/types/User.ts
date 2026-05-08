import { Note } from './Note';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    notes: Note[];
}