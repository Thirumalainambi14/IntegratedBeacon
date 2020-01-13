const mongoose = require('mongoose');

let documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  adhaarPath: {
    type: String,
    required: true
  },
  incomePath: {
    type: String,
    required: true
  },
  addressProofPath: {
    type: String,
    required: true
  },
  educationalProofPath: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Document', documentSchema);