import AuthRoute from './AuthRoute';
import { RouteProps } from '../../types/props/RouteProps';
import { APP_ROUTES } from '@/lib/navigation/app-routes';

export default function PublicRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth={false} redirectTo={APP_ROUTES.home}>
            {children}
        </AuthRoute>
    );
}
