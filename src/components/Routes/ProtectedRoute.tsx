import AuthRoute from './AuthRoute';
import { RouteProps } from '../../types/props/RouteProps';

export default function ProtectedRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth redirectTo='/noauth'>
            {children}
        </AuthRoute>
    );
}
