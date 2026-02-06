const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/questions/exam/:examId
// @desc    Get all questions for an exam
// @access  Private (Teacher/Admin)
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.examId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Private (Teacher/Admin)
router.get('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
});

// @route   POST /api/questions
// @desc    Create new question
// @access  Private (Teacher/Admin)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const question = await Question.create(req.body);

    // Add question to exam
    await Exam.findByIdAndUpdate(
      req.body.examId,
      { $push: { questions: question._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// @route   POST /api/questions/bulk
// @desc    Create multiple questions
// @access  Private (Teacher/Admin)
router.post('/bulk', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { examId, questions } = req.body;

    const createdQuestions = await Question.insertMany(
      questions.map(q => ({ ...q, examId }))
    );

    // Add all questions to exam
    const questionIds = createdQuestions.map(q => q._id);
    await Exam.findByIdAndUpdate(
      examId,
      { $push: { questions: { $each: questionIds } } }
    );

    res.status(201).json({
      success: true,
      message: 'Questions created successfully',
      count: createdQuestions.length,
      questions: createdQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating questions',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private (Teacher/Admin)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Remove question from exam
    await Exam.findByIdAndUpdate(
      question.examId,
      { $pull: { questions: question._id } }
    );

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

module.exports = router;
