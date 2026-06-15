import AuthRoute from './AuthRoute';
import { RouteProps } from '../../types/props/RouteProps';
import { APP_ROUTES } from '@/lib/navigation/app-routes';

export default function ProtectedRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth redirectTo={APP_ROUTES.noAuth}>
            {children}
        </AuthRoute>
    );
}
