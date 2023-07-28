const mongoose = require('mongoose');

const joinedUsers = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide an artistId'],
      ref: 'User',
    },
    community: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide an OpportunityId'],
      ref: 'Community',
    },
    isJoined: {
      type: Boolean,
      default: false,
    },
    leaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

joinedUsers.index({ artist: 1, community: 1 }, { unique: true });

module.exports = mongoose.model('JoinedUser', joinedUsers);
