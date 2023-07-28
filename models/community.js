const mongoose = require('mongoose');
const validator = require('validator');

const communitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must be provided'],
      trim: true,
      maxlength: [20, 'Name must be less than or equal to 20 characters'],
      minlength: [5, 'Name must be greater than or equal to 5 characters'],
    },
    about: {
      type: String,
      required: [true, 'About must be provided'],
      validate: {
        validator: (about) => {
          about = about.split(' ');

          return about.length <= 100;
        },
        message: 'About must have less than or equal to 100 words',
      },
    },
    sector: {
      type: String,
      required: [true, 'Sector must be provided'],
      trim: true,
      maxlength: [20, 'sector must be less than or equal to 20 characters'],
      minlength: [5, 'sector must be greater than or equal to 5 characters'],
    },
    subGroup: {
      type: String,
      trim: true,
      maxlength: [20, 'subGroup must be less than or equal to 20 characters'],
      minlength: [5, 'subGroup must be greater than or equal to 5 characters'],
    },
    minAge: {
      type: Number,
      trim: true,
      min: [16, 'minAge must be greater than or equal to 16 years'],
      max: [70, 'minAge must be less than or equal to 70 years'],
    },
    art: {
      type: String,
      required: [true, 'art must be provided'],
      trim: true,
      maxlength: [20, 'art must be less than or equal to 20 characters'],
      minlength: [5, 'art must be greater than or equal to 5 characters'],
    },
    limit: {
      type: Number,
      required: [true, 'limit must be provided'],
      min: [1, 'limit must be greater than or equal to 1 years'],
      max: [1000, 'linit must be less than or equal to 1000 years'],
    },
    expertise: {
      type: [String],
      required: [true, 'expertise must be provided'],
      trim: true,
      maxlength: [20, 'expertise must be less than or equal to 20 characters'],
      minlength: [5, 'expertise must be greater than or equal to 5 characters'],
    },
    createdBy: {
      type: String,
      required: [true, 'createdBy must be provided'],
      unique: false,
      validate: {
        validator: (createdBy) => {
          validator.isEmail(createdBy);
        },
        message: 'Please provide a valid email address',
      },
      lowercase: true,
      trim: true,
    },
    totalJoinedMembers: {
      type: Number,
      default: 0,
      min: [0, 'limit must be greater than or equal to 0'],
      validate: {
        validator: function () {
          limit = this.limit;
          return this.totalJoinedMembers <= this.limit;
        },
        message: function () {
          return `totalJoinedMembers cannot exceed limit of ${limit}`;
        },
      },
    },
    joinedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'JoinedUser',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('community', communitySchema);
