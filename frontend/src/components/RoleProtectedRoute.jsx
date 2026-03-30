import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/api';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [userRole, setUserRole] = useState('');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuth(auth);
      
      if (auth) {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUserRole(userData.userType || '');
          } catch (e) {
            console.error('Error parsing user:', e);
          }
        }
      }
    };

    checkAuth();
    window.addEventListener('logout', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('logout', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Check role access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User doesn't have required role - show access denied
    return (
      <div className="access-denied" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#fee',
          border: '2px solid #c33',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px'
        }}>
          <h1 style={{ color: '#c33', marginBottom: '1rem' }}>🚫 Access Denied</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            You don't have permission to access this page.
          </p>
          <p style={{ color: '#666' }}>
            Your role: <strong>{userRole.replace('_', ' ').toUpperCase()}</strong>
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 2rem',
              background: '#4a0e0e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
