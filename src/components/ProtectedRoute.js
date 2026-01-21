import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  if (user === undefined) {
    // loading
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  // logged in
  return children;
}

