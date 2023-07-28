const mongoose = require('mongoose');

const userQuerySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: Number,
      max: 9999999999,
      min: 1000000000,
    },
    emailId: {
      type: String,
    },
    location: {
      type: String,
    },
    query: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('userQuery', userQuerySchema);
