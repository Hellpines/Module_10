import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthRouteProps } from '../../types/props/AuthRouteProps';

function AuthRoute({ children, requireAuth, redirectTo }: AuthRouteProps) {
    const { currentUser } = useAuth();
    const isAuthenticated = !!currentUser;

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (!requireAuth && isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}

export default AuthRoute;
