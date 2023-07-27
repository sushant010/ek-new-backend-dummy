const mongooose = require('mongoose');
const validator = require('validator');

const Schema = mongooose.Schema;

const joinSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Please provide a full_name.'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject.'],
      enum: {
        values: [
          'Business',
          'General',
          'Media',
          'Feedback',
          'Tech',
          'Suggestion',
          'Work',
        ],
        message:
          'Please provide a valid subjust. `Business`, `General`, `Media`, `Feedback`, `Tech`, `Suggestion` or `Work`.',
      },
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a email.'],
      unique: true,
      validate: {
        validator: (email) => {
          return validator.isEmail(email);
        },
        message: 'Please provide a valid email.',
      },
      lowercase: true,
      trim: true,
    },
    phone_number: {
      type: Number,
      required: [true, 'Please provide a phone_number.'],
      validate: {
        validator: (num) => {
          const phoneRegex = /^\d{10}$/;
          return phoneRegex.test(num);
        },
        message: 'Please provide a valid phone_number.',
      },
    },
    message: {
      type: String,
      required: [true, 'Please provide a message.'],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: (link) => {
          return validator.isURL(link);
        },
        message: 'Please provide a valid link.',
      },
    },
    organization: {
      type: String,
      trim: true,
    },
    intrestedIn: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model('Join', joinSchema);
