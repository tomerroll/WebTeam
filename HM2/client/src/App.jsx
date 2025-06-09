import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/shared/Login';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import Practice from './components/student/Practice';
import PracticeSubject from './components/student/PracticeSubject';
import Theory from './components/shared/Theory';
import Help from './components/student/Help';
import Settings from './components/shared/Settings';
import ManageStudents from './components/teacher/ManageStudents';
import ManageExercises from './components/teacher/ManageExercises';
import Reports from './components/teacher/Reports';
import TeacherHelpForum from './components/teacher/TeacherHelpForum'; 
import Profile from './components/shared/Profile';
import Leaderboard from './components/shared/Leaderboard';
import PrivateRoute from './components/shared/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
