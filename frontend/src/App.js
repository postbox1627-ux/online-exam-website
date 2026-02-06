import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Student Module
import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeExam from './pages/student/TakeExam';
import ExamResult from './pages/student/ExamResult';
import StudentResults from './pages/student/StudentResults';

// Admin/Teacher Module
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageExams from './pages/admin/ManageExams';
import CreateExam from './pages/admin/CreateExam';
import ManageQuestions from './pages/admin/ManageQuestions';
import ViewResults from './pages/admin/ViewResults';
import ManageUsers from './pages/admin/ManageUsers';

// System/Monitoring Module
import MonitoringDashboard from './pages/monitoring/MonitoringDashboard';
import ExamMonitoring from './pages/monitoring/ExamMonitoring';

import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/student/login" />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/exam/:examId"
              element={
                <PrivateRoute role="student">
                  <TakeExam />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/result/:resultId"
              element={
                <PrivateRoute role="student">
                  <ExamResult />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <PrivateRoute role="student">
                  <StudentResults />
                </PrivateRoute>
              }
            />

            {/* Admin/Teacher Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <ManageExams />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exam/create"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <CreateExam />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exam/:examId/questions"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <ManageQuestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <ViewResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute role="admin">
                  <ManageUsers />
                </PrivateRoute>
              }
            />

            {/* Monitoring Routes */}
            <Route
              path="/monitoring/dashboard"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <MonitoringDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/monitoring/exam/:examId"
              element={
                <PrivateRoute role={['admin', 'teacher']}>
                  <ExamMonitoring />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
