import { Item } from './Item';
import { StatusType } from './StatusType';

export interface Note {
    id: number;
    title: string;
    items: Item[];
    status: StatusType;
}