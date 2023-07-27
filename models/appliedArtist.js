const mongoose = require('mongoose');

const appliedArtist = mongoose.Schema(
  {
    artist: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide an artistId'],
      ref: 'User',
    },
    opportunity: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide an OpportunityId'],
      ref: 'Opportunity',
    },
    isHired: {
      type: Boolean,
      default: false,
    },
    isShortListed: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

appliedArtist.index({ artist: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Applied', appliedArtist);
