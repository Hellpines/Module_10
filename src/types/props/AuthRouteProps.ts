import { ReactNode } from 'react';

export interface AuthRouteProps {
    children: ReactNode;
    requireAuth: boolean;
    redirectTo: string;
}
