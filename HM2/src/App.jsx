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
import Profile from './components/Profile'; // Assuming you have a Profile component
import Leaderboard from './components/Leaderboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/:subject" element={<PracticeSubject />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/manage-exercises" element={<ManageExercises />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/teacher-help-forum" element={<TeacherHelpForum />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;