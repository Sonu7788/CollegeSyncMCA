const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String },
  studentBranch: { type: String },
  className: { type: String },
  subject: { type: String },
  toTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: String },
  image: { type: String, default: '' }, // <-- NEW: Optional Image (Base64)
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedAt: { type: Date },
  approvedBy: { type: String },
  teacherSignature: { type: String }
});

module.exports = mongoose.model('Application', ApplicationSchema);