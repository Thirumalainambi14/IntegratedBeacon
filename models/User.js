const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['faculty', 'student', 'superuser']
  }
  // rollno: String
  // tokenVerify: String,
  // tokenVerifyExpiration: Date
});

module.exports = mongoose.model('User', userSchema);