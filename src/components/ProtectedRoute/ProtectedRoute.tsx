import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ProtectedRouteProps } from '../../types/ProtectedRouteProps';

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = useContext(AuthContext);

    if (!auth?.currentUser) {
        return <Navigate to='/noauth' replace />;
    }

    return children;
}

export default ProtectedRoute;