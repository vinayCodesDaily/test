import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading && !user) {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <div className="btn" disabled>Loading user profile...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles.length > 0) {
        const userRoleName = user?.role ? (typeof user.role === 'string' ? user.role : user.role.name) : null;
        const normalizedRole = userRoleName ? userRoleName.toString().trim().toLowerCase() : null;
        const hasRequiredRole = normalizedRole && requiredRoles.some(role => role.toLowerCase() === normalizedRole);
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};
