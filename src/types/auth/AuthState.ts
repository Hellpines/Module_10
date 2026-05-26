import { User } from '../auth/User';

export interface AuthState {
    currentUser: User | null;
    token: string | null;
}
