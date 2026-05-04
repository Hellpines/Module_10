import { User } from './User';

export interface AuthContextParts {
    users: User[];
    currentUser: User | null;
    signIn: (email: string, password: string) => User | null;
    signUp: (email: string, password: string) => boolean;
    signOut: () => void;
}