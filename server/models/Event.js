const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  logo: { type: String }, 
  details: { type: String },
  dateTime: { type: Date, required: true },
  isMustJoin: { type: Boolean, default: false },
  branches: [{ type: String }],
  attendanceCode: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);