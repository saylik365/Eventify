import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user, globalRole, ownerOf, cohostOf, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles) {
    // Allow if user has any of the allowed roles
    const hasRole =
      (roles.includes('admin') && globalRole === 'admin') ||
      (roles.includes('owner') && ownerOf && ownerOf.length > 0) ||
      (roles.includes('cohost') && cohostOf && cohostOf.length > 0) ||
      (roles.includes('user') && globalRole === 'user');
    if (!hasRole) return <Navigate to="/403" replace />;
  }
  return children;
};

export default PrivateRoute; 