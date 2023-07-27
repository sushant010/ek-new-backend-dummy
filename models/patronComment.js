const mongoose = require('mongoose');

const comment = mongoose.Schema({
  patronId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'ArtistId must be provided.'],
  },
  artistId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'hiredBy must be provided.'],
  },
  comment: {
    type: String,
    required: [true, 'comment must be provided!'],
  },
});

module.exports = mongoose.model('patronComment', comment);
