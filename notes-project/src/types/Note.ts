import { Item } from './Item';

export interface Note {
    id: number;
    title: string;
    items: Item[];
    status: 'active' | 'archived' | 'trash'
}