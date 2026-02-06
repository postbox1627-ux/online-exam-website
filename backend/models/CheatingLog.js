const mongoose = require('mongoose');

const cheatingLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  alertType: {
    type: String,
    enum: [
      'face_not_visible',
      'multiple_faces',
      'tab_switched',
      'window_blur',
      'fullscreen_exit',
      'no_face_detected',
      'suspicious_movement'
    ],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  screenshot: {
    type: String,
    default: ''
  },
  warningsSent: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
cheatingLogSchema.index({ studentId: 1, examId: 1, timestamp: -1 });

module.exports = mongoose.model('CheatingLog', cheatingLogSchema);
