import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/api';

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
