import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableExams();
  }, []);

  const fetchAvailableExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExams(response.data.exams);
      setLoading(false);
    } catch (error) {
      setError('Failed to load exams');
      setLoading(false);
    }
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Online Exam Management System</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Available Exams</h1>
          <p className="subtitle">Select an exam to begin</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="exams-grid">
          {exams.length === 0 ? (
            <div className="no-exams">
              <p>No exams available at the moment</p>
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam._id} className="exam-card">
                <div className="exam-card-header">
                  <h3>{exam.title}</h3>
                  <span className="exam-subject">{exam.subject}</span>
                </div>
                <div className="exam-card-body">
                  <div className="exam-info">
                    <div className="info-item">
                      <span className="info-label">Duration:</span>
                      <span className="info-value">{exam.duration} mins</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Marks:</span>
                      <span className="info-value">{exam.totalMarks}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Scheduled:</span>
                      <span className="info-value">
                        {new Date(exam.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {exam.description && (
                    <p className="exam-description">{exam.description}</p>
                  )}
                </div>
                <div className="exam-card-footer">
                  <button
                    onClick={() => handleStartExam(exam._id)}
                    className="btn-start-exam"
                  >
                    Start Exam
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/student/results')}
            className="btn-view-results"
          >
            View My Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
