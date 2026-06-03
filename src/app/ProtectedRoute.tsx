import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebase';

function ProtectedRoute({ children }: { children: React.ReactNode}) {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <div className="min-h-screen bg-[#B8C4D4] flex items-center justify-center">
      <p className="text-[#162B40] font-semibold">Cargando...</p>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;