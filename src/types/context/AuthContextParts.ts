import { User } from '../auth/User';

export interface AuthContextParts {
    currentUser: User | null;
    updateProfile: (updatedData: Partial<User>, file?: File) => Promise<User | null>;
    login: (email: string, password: string) => Promise<User | null>;
    signUp: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    isAuthLoading: boolean;
}
