const express = require('express');
const router = express.Router();
const CheatingLog = require('../models/CheatingLog');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/monitoring/alert
// @desc    Log cheating alert
// @access  Private (Student - self-reporting)
router.post('/alert', protect, async (req, res) => {
  try {
    const { examId, alertType, description, severity } = req.body;

    const log = await CheatingLog.create({
      studentId: req.user.id,
      examId,
      alertType,
      description,
      severity: severity || 'medium'
    });

    // Emit socket event to admin/teacher
    const io = req.app.get('io');
    io.to(`exam_${examId}`).emit('cheatingAlert', {
      studentId: req.user.id,
      studentName: req.user.name,
      examId,
      alertType,
      description,
      severity,
      timestamp: log.timestamp
    });

    res.status(201).json({
      success: true,
      message: 'Alert logged successfully',
      log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging alert',
      error: error.message
    });
  }
});

// @route   GET /api/monitoring/exam/:examId
// @desc    Get all alerts for an exam
// @access  Private (Teacher/Admin)
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const alerts = await CheatingLog.find({ examId: req.params.examId })
      .populate('studentId', 'name email')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
});

// @route   GET /api/monitoring/student/:studentId/exam/:examId
// @desc    Get alerts for a specific student in an exam
// @access  Private (Teacher/Admin)
router.get('/student/:studentId/exam/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const alerts = await CheatingLog.find({
      studentId: req.params.studentId,
      examId: req.params.examId
    }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student alerts',
      error: error.message
    });
  }
});

// @route   POST /api/monitoring/warning/:studentId
// @desc    Send warning to student
// @access  Private (Teacher/Admin)
router.post('/warning/:studentId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { examId, message } = req.body;

    // Update warning count
    await CheatingLog.updateMany(
      { studentId: req.params.studentId, examId },
      { $inc: { warningsSent: 1 } }
    );

    // Emit warning via socket
    const io = req.app.get('io');
    io.to(`exam_${examId}`).emit('warning', {
      studentId: req.params.studentId,
      message,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Warning sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending warning',
      error: error.message
    });
  }
});

// @route   PUT /api/monitoring/resolve/:id
// @desc    Resolve/dismiss an alert
// @access  Private (Teacher/Admin)
router.put('/resolve/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const alert = await CheatingLog.findByIdAndUpdate(
      req.params.id,
      { isResolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert resolved',
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
      error: error.message
    });
  }
});

// @route   GET /api/monitoring/summary/:examId
// @desc    Get monitoring summary for an exam
// @access  Private (Teacher/Admin)
router.get('/summary/:examId', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const alerts = await CheatingLog.find({ examId: req.params.examId });

    const summary = {
      totalAlerts: alerts.length,
      byType: {},
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0
      },
      resolved: alerts.filter(a => a.isResolved).length,
      unresolved: alerts.filter(a => !a.isResolved).length
    };

    // Count by type
    alerts.forEach(alert => {
      summary.byType[alert.alertType] = (summary.byType[alert.alertType] || 0) + 1;
      summary.bySeverity[alert.severity]++;
    });

    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monitoring summary',
      error: error.message
    });
  }
});

module.exports = router;
