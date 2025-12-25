const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String },
  file: { type: String, required: true }, // Base64 PDF/Doc
  branches: [{ type: String }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);