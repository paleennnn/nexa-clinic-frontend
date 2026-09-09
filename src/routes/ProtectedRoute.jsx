import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute({ children, roles }) {
  const { status, user } = useAuth();

  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner label="Memeriksa sesi..." />
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
