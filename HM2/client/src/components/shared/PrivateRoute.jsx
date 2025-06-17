import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ChatRobot from '../student/ChatRobot';

/**
 * PrivateRoute Component
 * 
 * A wrapper component that provides authentication protection for routes.
 * It checks if a user is authenticated by looking for a token in localStorage.
 * If not authenticated, it redirects to the login page.
 * If authenticated, it renders the protected content with navigation and optional chat robot.
 * 
 * @param {React.ReactNode} children - The components to render if user is authenticated
 * @returns {JSX.Element} - Either a redirect to login or the protected content
 */
const PrivateRoute = ({ children }) => {
  // Get authentication token and user type from localStorage
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content with navigation and optional chat robot for students
  return (
    <div className="min-h-screen">
      <Navbar userType={userType} />
      <main className="pt-20">
        {children}
      </main>
      {/* Only show chat robot for student users */}
      {userType === 'student' && <ChatRobot />}
    </div>
  );
};

export default PrivateRoute;
