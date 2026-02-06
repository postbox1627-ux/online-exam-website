const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/results/submit
// @desc    Submit exam and calculate results
// @access  Private (Student)
router.post('/submit', protect, authorize('student'), async (req, res) => {
  try {
    const { examId, answers, startTime } = req.body;

    // Get exam and questions
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if already submitted
    const existingResult = await Result.findOne({
      studentId: req.user.id,
      examId
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Exam already submitted'
      });
    }

    // Calculate results
    let totalScore = 0;
    let maxScore = 0;
    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      maxScore += question.marks;

      let isCorrect = false;
      let marksObtained = 0;

      // Check if answer is correct
      if (question.questionType === 'mcq') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && correctOption.text === answer.selectedAnswer;
        marksObtained = isCorrect ? question.marks : 0;
      }

      totalScore += marksObtained;

      evaluatedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        marksObtained
      });
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const isPassed = percentage >= (exam.passingMarks || 40);

    // Calculate time taken
    const submitTime = new Date();
    const timeTaken = Math.floor((submitTime - new Date(startTime)) / 1000);

    // Create result
    const result = await Result.create({
      studentId: req.user.id,
      examId,
      answers: evaluatedAnswers,
      totalScore,
      maxScore,
      percentage: percentage.toFixed(2),
      isPassed,
      startTime,
      submitTime,
      timeTaken,
      status: 'submitted'
    });

    res.status(201).json({
      success: true,
      message: 'Exam submitted successfully',
      result: {
        id: result._id,
        totalScore,
        maxScore,
        percentage: percentage.toFixed(2),
        isPassed,
        timeTaken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting exam',
      error: error.message
    });
  }
});

// @route   GET /api/results/student/:studentId
// @desc    Get all results for a student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    // Students can only view their own results
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these results'
      });
    }

    const results = await Result.find({ studentId: req.params.studentId })
      .populate('examId', 'title subject scheduledDate totalMarks')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
});

// @route   GET /api/results/exam/:examId
// @desc    Get all results for an exam
// @access  Private (Teacher/Admin)
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('studentId', 'name email')
      .sort({ totalScore: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exam results',
      error: error.message
    });
  }
});

// @route   GET /api/results/:id
// @desc    Get single result with detailed answers
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('examId', 'title subject allowReview')
      .populate('studentId', 'name email')
      .populate('answers.questionId');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Students can only view their own results
    if (req.user.role === 'student' && result.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result'
      });
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching result details',
      error: error.message
    });
  }
});

// @route   GET /api/results/export/:examId
// @desc    Export exam results
// @access  Private (Teacher/Admin)
router.get('/export/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate('studentId', 'name email')
      .populate('examId', 'title subject');

    const exportData = results.map(result => ({
      Student: result.studentId.name,
      Email: result.studentId.email,
      Exam: result.examId.title,
      Subject: result.examId.subject,
      Score: `${result.totalScore}/${result.maxScore}`,
      Percentage: `${result.percentage}%`,
      Status: result.isPassed ? 'Passed' : 'Failed',
      TimeTaken: `${Math.floor(result.timeTaken / 60)} min`,
      SubmittedAt: result.submitTime
    }));

    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error exporting results',
      error: error.message
    });
  }
});

// @route   GET /api/results/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Teacher/Admin)
router.get('/dashboard/stats', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const totalExams = await Exam.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuestions = await Question.countDocuments();
    const totalResults = await Result.countDocuments();

    const recentResults = await Result.find()
      .populate('studentId', 'name')
      .populate('examId', 'title subject')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalExams,
        totalStudents,
        totalQuestions,
        totalResults
      },
      recentResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;
