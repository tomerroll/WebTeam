import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Practice from './components/Practice';
import PracticeSubject from './components/PracticeSubject';
import Theory from './components/Theory';
import Help from './components/Help';
import Settings from './components/Settings';
import ManageStudents from './components/ManageStudents';
import ManageExercises from './components/ManageExercises';
import Reports from './components/Reports';
import TeacherHelpForum from './components/TeacherHelpForum'; 
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף ההתחברות פתוח */}
        <Route path="/login" element={<Login />} />

        {/* כל שאר הדפים מוגנים */}
        <Route path="/student-dashboard" element={
          <PrivateRoute><StudentDashboard /></PrivateRoute>
        } />
        <Route path="/teacher-dashboard" element={
          <PrivateRoute><TeacherDashboard /></PrivateRoute>
        } />
        <Route path="/practice" element={
          <PrivateRoute><Practice /></PrivateRoute>
        } />
        <Route path="/practice/:subject" element={
          <PrivateRoute><PracticeSubject /></PrivateRoute>
        } />
        <Route path="/theory" element={
          <PrivateRoute><Theory /></PrivateRoute>
        } />
        <Route path="/help" element={
          <PrivateRoute><Help /></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />
        <Route path="/manage-students" element={
          <PrivateRoute><ManageStudents /></PrivateRoute>
        } />
        <Route path="/manage-exercises" element={
          <PrivateRoute><ManageExercises /></PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute><Reports /></PrivateRoute>
        } />
        <Route path="/teacher-help-forum" element={
          <PrivateRoute><TeacherHelpForum /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/leaderboard" element={
          <PrivateRoute><Leaderboard /></PrivateRoute>
        } />

        {/* ברירת מחדל מפנה להתחברות */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
