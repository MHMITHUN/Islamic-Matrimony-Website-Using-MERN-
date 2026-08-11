import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Guardian dashboard routes — also allows the env-admin (who has isGuardian? false but isAdmin true)
// to preview the guardian experience. Mirrors AdminRoute.
const GuardianRoute = ({ children }) => {
    const { user, loading, isGuardian, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-muted-foreground">Checking guardian access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isGuardian && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuardianRoute;
