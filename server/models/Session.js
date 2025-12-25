const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  date: { type: Date, default: Date.now },
  code: { type: String, required: true }, // 4-digit code for attendance
  attendedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Students who joined
});

module.exports = mongoose.model('Session', SessionSchema);