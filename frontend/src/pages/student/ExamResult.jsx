import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import jsPDF from 'jspdf';
import '../../styles/App.css';

const ExamResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/results/${resultId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setResult(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching result:', error);
      alert('Failed to load result');
      navigate('/student/dashboard');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Exam Result', 105, 20, { align: 'center' });
    
    // Student Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${result.studentId.name}`, 20, 40);
    doc.text(`Exam: ${result.examId.title}`, 20, 50);
    doc.text(`Subject: ${result.examId.subject}`, 20, 60);
    doc.text(`Date: ${new Date(result.submitTime).toLocaleDateString()}`, 20, 70);
    
    // Score
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`Score: ${result.totalScore}/${result.maxScore}`, 20, 90);
    doc.text(`Percentage: ${result.percentage}%`, 20, 100);
    doc.text(`Status: ${result.isPassed ? 'PASSED' : 'FAILED'}`, 20, 110);
    
    // Time taken
    const minutes = Math.floor(result.timeTaken / 60);
    const seconds = result.timeTaken % 60;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Time Taken: ${minutes}m ${seconds}s`, 20, 130);
    
    // Download
    doc.save(`exam-result-${result._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading result...</p>
      </div>
    );
  }

  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header">
          <h1>🎉 Congratulations, {result.studentId.name}!</h1>
          <p>You have completed the {result.examId.title}</p>
        </div>

        <div className="result-body">
          <div className="score-circle">
            <div className="score-value">
              {result.totalScore}/{result.maxScore}
            </div>
            <div className="score-label">Your Score</div>
          </div>

          <div className="result-details">
            <div className="detail-item">
              <div className="detail-label">Subject</div>
              <div className="detail-value">{result.examId.subject}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Percentage</div>
              <div className="detail-value">{result.percentage}%</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div 
                className="detail-value" 
                style={{ 
                  color: result.isPassed ? 'var(--success-color)' : 'var(--danger-color)' 
                }}
              >
                {result.isPassed ? 'PASSED ✓' : 'FAILED ✗'}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Time Taken</div>
              <div className="detail-value">{minutes}m {seconds}s</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Submitted At</div>
              <div className="detail-value">
                {new Date(result.submitTime).toLocaleString()}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Questions Attempted</div>
              <div className="detail-value">
                {result.answers.length} / {result.answers.length}
              </div>
            </div>
          </div>

          {/* Answer Review Section */}
          {result.examId.allowReview && (
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="btn-action"
                style={{ 
                  backgroundColor: 'var(--info-color)',
                  color: 'white',
                  padding: '0.75rem 2rem'
                }}
              >
                {showAnswers ? 'Hide Answers' : 'View Answers'}
              </button>

              {showAnswers && (
                <div style={{ 
                  marginTop: '2rem', 
                  textAlign: 'left',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {result.answers.map((answer, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'var(--bg-color)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        borderLeft: `4px solid ${
                          answer.isCorrect ? 'var(--success-color)' : 'var(--danger-color)'
                        }`
                      }}
                    >
                      <h4>Question {index + 1}</h4>
                      <p><strong>Question:</strong> {answer.questionId.questionText}</p>
                      <p><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
                      <p><strong>Correct Answer:</strong> {
                        answer.questionId.options.find(opt => opt.isCorrect)?.text
                      }</p>
                      <p style={{ 
                        color: answer.isCorrect ? 'var(--success-color)' : 'var(--danger-color)',
                        fontWeight: 'bold'
                      }}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'} 
                        ({answer.marksObtained}/{answer.questionId.marks} marks)
                      </p>
                      {answer.questionId.explanation && (
                        <p><strong>Explanation:</strong> {answer.questionId.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="result-actions">
          <button
            onClick={downloadPDF}
            className="btn-action"
            style={{ 
              backgroundColor: 'var(--success-color)',
              color: 'white' 
            }}
          >
            📥 Download PDF Report
          </button>
          
          <button
            onClick={() => navigate('/student/dashboard')}
            className="btn-action"
            style={{ 
              backgroundColor: 'var(--secondary-color)',
              color: 'white' 
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
