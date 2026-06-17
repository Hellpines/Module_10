import type { User } from '../../src/types/auth/User';
import type { Note } from '../../src/types/notes/Note';
import type { NoteStatus } from '../../src/types/notes/NoteStatus';

export interface GraphQLRequestBody<TVariables extends object = object> {
    variables?: TVariables;
}

export interface UpdateProfileVariables {
    input?: Partial<User>;
}

export interface UpdateTodoVariables {
    id?: Note['id'];
    input?: Pick<Note, 'title' | 'content' | 'items'>;
}

export interface CreateTodoVariables {
    input?: Pick<Note, 'title' | 'content' | 'items'>;
}

export interface ChangeTodoStatusVariables {
    id?: Note['id'];
    newStatus?: NoteStatus;
}

export interface DeleteTodoVariables {
    id?: Note['id'];
}

export function parseGraphQLVariables<TVariables extends object>(
    postData: string | null
): Partial<TVariables> {
    if (!postData) {
        return {};
    }

    const body = JSON.parse(postData) as GraphQLRequestBody<TVariables>;
    return body.variables ?? {};
}
