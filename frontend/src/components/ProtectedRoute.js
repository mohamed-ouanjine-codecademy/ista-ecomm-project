// frontend/src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(UserContext);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
