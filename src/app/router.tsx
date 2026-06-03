import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { QuotesPage } from "../features/quotes/pages/QuotesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Navigate to="/quotes" replace />,
      },
      {
        path: "/quotes",
        element: <QuotesPage />,
      },
    ],
  },
]);