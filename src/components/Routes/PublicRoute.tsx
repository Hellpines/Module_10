import AuthRoute from './AuthRoute';
import { RouteProps } from '../../types/props/RouteProps';

function PublicRoute({ children }: RouteProps) {
    return (
        <AuthRoute requireAuth={false} redirectTo='/'>
            {children}
        </AuthRoute>
    );
}

export default PublicRoute;
