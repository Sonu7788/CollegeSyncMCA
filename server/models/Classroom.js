const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "CSE Section A"
  branch: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Enrolled students
});

module.exports = mongoose.model('Classroom', ClassroomSchema);