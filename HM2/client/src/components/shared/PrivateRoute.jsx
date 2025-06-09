import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar userType={userType} />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default PrivateRoute;
