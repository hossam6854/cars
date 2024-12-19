import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRouteuser = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== 'user') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRouteuser;
