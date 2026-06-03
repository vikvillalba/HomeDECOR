// router.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import ProtectedRoute from './ProtectedRoute';
import { DashboardCotizaciones } from '../features/cotizaciones/DashboardCotizaciones';
import { LoginPage } from '../features/auth/pages/LoginPage';



export default function Router() {
  const [user, loading] = useAuthState(auth);

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboardcotizaciones" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboardcotizaciones"
        element={
          <ProtectedRoute>
            <DashboardCotizaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboardcotizaciones" : "/login"} replace />}
      />
    </Routes>
  );
}