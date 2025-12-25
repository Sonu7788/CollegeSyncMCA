const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  branch: { type: String, required: true }, // CSE, IT, ECE
  signature: { type: String, default: '' } // Base64 image
});

module.exports = mongoose.model('User', UserSchema);