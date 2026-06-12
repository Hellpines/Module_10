import AuthRoute from './AuthRoute';
import { RouteProps } from '../../types/props/RouteProps';

export default function PublicRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth={false} redirectTo='/'>
            {children}
        </AuthRoute>
    );
}
