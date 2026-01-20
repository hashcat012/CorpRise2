import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(location.state?.user ? true : null);
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    // If user data passed from AuthCallback, skip auth check
    if (location.state?.user) {
      return;
    }

    const checkAuth = async () => {
      try {        
        if (!response.ok) throw new Error('Not authenticated');
        
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}