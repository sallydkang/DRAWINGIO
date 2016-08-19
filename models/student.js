var mongoose = require('mongoose');

// The factSchema is used to embedded docs in as tudent doc.
// There is no model and no 'facts' collection
var factSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now }
});

var studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  cohort: Number,
  facts: [factSchema],
  googleId: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
