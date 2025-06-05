import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, user, role }) {
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/home" />;
  return children;
}

export default PrivateRoute;