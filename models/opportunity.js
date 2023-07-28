const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');
const Schema = mongoose.Schema;

const opportunitySchema = new Schema(
  {
    posted_by_email: {
      type: String, //email of the patron who is posting this opportunity
      trim: true,
      required: [true, 'posted_by_email is must be provided!'],
    },
    position: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'position must be provided!'],
    },
    about: {
      type: String,
      trim: [true, 'about must be provided!'],
    },
    requirements: {
      type: String,
      trim: true,
    },
    duration: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    number: {
      type: Number,
    },
    location: {
      type: String,
      trim: true,
    },
    link_of_document: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return ['Online', 'Offline', 'Hybrid'].includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid mode, please use either 'Online', 'Offline' or 'Hybrid'`,
      },
    },
    language: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    type: {
      type: String,
      trim: true,
      validate: {
        validator: (type) => {
          return ['Solo', 'Group'].includes(type);
        },
        message: (props) => {
          return `${props.value} is not a valid type, please use either 'Solo' or 'Group'`;
        },
      },
    },
    budget: {
      type: Number,
      trim: true,
    },
    totalApplication: {
      type: Number,
      default: 0,
    },
    shortListed: [
      {
        type: mongoose.Types.ObjectId,
        // select: false,
        ref: 'Applied',
      },
    ],
    hired: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Applied',
      },
    ],
    rejected: [
      {
        type: mongoose.Types.ObjectId,
        // select: false,
        ref: 'Applied',
      },
    ],
    appliedBy: [
      {
        type: mongoose.Types.ObjectId,
        // select: false,
        ref: 'Applied',
      },
    ],
  },
  { timestamps: true }
);

opportunitySchema.pre('save', function (next) {
  // console.log(this.appliedBy.length);
  this.totalApplication = this.appliedBy.length;
  next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
