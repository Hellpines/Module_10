import { User } from './User';

export interface AuthContextParts {
    currentUser: User | null;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    signIn: (email: string, password: string) => User | null;
    signUp: (email: string, password: string) => boolean;
    signOut: () => void;
    refreshToken: () => Promise<string | null>;
    requestWithAuth: (action: () => void) => Promise<void>;
}