const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/exams
// @desc    Get all exams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Students see only active exams
    if (req.user.role === 'student') {
      query.isActive = true;
    }

    const exams = await Exam.find(query)
      .populate('createdBy', 'name email')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exams',
      error: error.message
    });
  }
});

// @route   GET /api/exams/:id
// @desc    Get single exam
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exam',
      error: error.message
    });
  }
});

// @route   POST /api/exams
// @desc    Create new exam
// @access  Private (Teacher/Admin)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const examData = {
      ...req.body,
      createdBy: req.user.id
    };

    const exam = await Exam.create(examData);

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: error.message
    });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Private (Teacher/Admin)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      exam: updatedExam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating exam',
      error: error.message
    });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Delete associated questions
    await Question.deleteMany({ examId: req.params.id });

    // Delete the exam
    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exam',
      error: error.message
    });
  }
});

// @route   GET /api/exams/:id/questions
// @desc    Get exam questions for student
// @access  Private (Student)
router.get('/:id/questions', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Get questions without showing correct answers
    let questions = await Question.find({ examId: req.params.id })
      .select('-correctAnswer')
      .sort({ order: 1 });

    // Randomize if needed
    if (exam.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    res.status(200).json({
      success: true,
      exam: {
        id: exam._id,
        title: exam.title,
        subject: exam.subject,
        duration: exam.duration,
        totalMarks: exam.totalMarks
      },
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exam questions',
      error: error.message
    });
  }
});

// @route   GET /api/exams/available/student
// @desc    Get available exams for student
// @access  Private (Student)
router.get('/available/student', protect, authorize('student'), async (req, res) => {
  try {
    const currentDate = new Date();

    // Get exams that are active and scheduled
    const exams = await Exam.find({
      isActive: true,
      scheduledDate: { $lte: currentDate }
    })
    .select('title subject duration scheduledDate totalMarks')
    .sort({ scheduledDate: -1 });

    // Check which exams student has already taken
    const results = await Result.find({ studentId: req.user.id });
    const takenExamIds = results.map(r => r.examId.toString());

    const availableExams = exams.map(exam => ({
      ...exam.toObject(),
      isTaken: takenExamIds.includes(exam._id.toString())
    }));

    res.status(200).json({
      success: true,
      exams: availableExams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available exams',
      error: error.message
    });
  }
});

module.exports = router;
