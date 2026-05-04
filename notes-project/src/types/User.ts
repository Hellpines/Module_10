import { Note } from './Note';

export interface User {
    id: number;
    name?: string;
    surname?: string;
    email: string;
    password: string;
    notes: Note[];
}