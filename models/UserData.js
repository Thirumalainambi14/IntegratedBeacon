const mongoose = require('mongoose');

let userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstname: String,
  lastname: String,
  dob: Date,
  educationalQualification: String,
  religionOrCaste: String,
  presendAdd: String,
  permanentAdd: String,
  residence: String,
  working: String,
  contact1: Number,
  contact2: Number,
  coursePref: [String]
});

module.exports = mongoose.model('UserData', userDataSchema);