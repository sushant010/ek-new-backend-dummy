const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: Number,
      required: true,
      min: 6,
    },
    expirationTime: {
      type: Date,
      required: true,
    },
    userId: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model('otp', otpSchema);
