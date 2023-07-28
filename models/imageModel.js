const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
