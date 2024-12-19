import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
