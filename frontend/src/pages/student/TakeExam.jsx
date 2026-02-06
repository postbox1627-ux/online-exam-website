import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import '../../styles/App.css';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(new Date());
  
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchExamData();
    initializeSocket();
    startCamera();
    preventCheating();
    
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const fetchExamData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/exams/${examId}/questions`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setExam(response.data.exam);
      setQuestions(response.data.questions);
      setTimeLeft(response.data.exam.duration * 60); // Convert to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to load exam');
      navigate('/student/dashboard');
    }
  };

  const initializeSocket = () => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinExam', examId);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      sendAlert('face_not_visible', 'Camera access denied', 'high');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const preventCheating = () => {
    // Detect tab switch
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        sendAlert('tab_switched', 'Tab was switched', 'high');
      }
    });

    // Detect window blur
    window.addEventListener('blur', () => {
      sendAlert('window_blur', 'Window lost focus', 'medium');
    });

    // Detect fullscreen exit
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        sendAlert('fullscreen_exit', 'Exited fullscreen mode', 'medium');
      }
    });

    // Request fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Fullscreen request failed:', err);
    });

    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Disable certain keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u')) ||
        (e.key === 'F12') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        sendAlert('suspicious_movement', 'Attempted keyboard shortcut', 'low');
      }
    });
  };

  const sendAlert = async (alertType, description, severity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/monitoring/alert',
        {
          examId,
          alertType,
          description,
          severity
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the exam?')) {
      await submitExam();
    }
  };

  const handleAutoSubmit = async () => {
    alert('Time is up! Your exam is being submitted automatically.');
    await submitExam();
  };

  const submitExam = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        selectedAnswer: answer
      }));

      const response = await axios.post(
        'http://localhost:5000/api/results/submit',
        {
          examId,
          answers: formattedAnswers,
          startTime
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      navigate(`/student/result/${response.data.result.id}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isAnswered = (questionId) => {
    return answers.hasOwnProperty(questionId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading exam...</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="exam-container">
      {/* Header with Timer */}
      <div className="exam-header">
        <div className="exam-title">
          <h2>{exam.title}</h2>
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {/* Hidden Camera Feed for Monitoring */}
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        style={{ display: 'none' }}
      />

      {/* Question Navigator */}
      <div className="question-navigator">
        <h3>Questions</h3>
        <div className="navigator-grid">
          {questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestion(index)}
              className={`nav-button ${
                index === currentQuestion ? 'current' : ''
              } ${isAnswered(q._id) ? 'answered' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Display */}
      <div className="question-container">
        <div className="question-header">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <div className="question-text">
          {question.questionText}
        </div>

        <div className="options-container">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`option ${
                answers[question._id] === option.text ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={option.text}
                checked={answers[question._id] === option.text}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              />
              <span>{String.fromCharCode(65 + index)}. {option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="exam-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-nav"
        >
          Previous
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-submit-exam"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-nav"
          >
            Next
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center', 
        color: 'var(--text-secondary)' 
      }}>
        <p>
          Answered: {Object.keys(answers).length} / {questions.length} questions
        </p>
      </div>
    </div>
  );
};

export default TakeExam;
