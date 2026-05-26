import AuthRoute from './AuthRoute';
import { RouteProps } from 'react-router-dom';

function ProtectedRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth redirectTo='/noauth'>
            {children}
        </AuthRoute>
    );
}

export default ProtectedRoute;
