import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    // Check authentication on mount and route change
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };

    checkAuth();

    // Listen for logout events
    window.addEventListener('logout', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('logout', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
