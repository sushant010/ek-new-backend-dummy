const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({});

publishedCourses: [
  {
    select: false,
    _id: false,
    title: {
      type: String,
      // required: [true, 'title must be provided'],
      trim: true,
      maxlength: [20, 'title must be less than or equal to 20 characters'],
      minlength: [5, 'title must be greater than or equal to 5 characters'],
    },
    aboutCourse: {
      type: String,
      // required: [true, 'About must be provided'],
      validate: {
        validator: (about) => {
          about = about.split(' ');

          return about.length <= 100;
        },
        message: 'About must have less than or equal to 100 words',
      },
    },
    aboutAgency: {
      type: String,
      // required: [true, 'About must be provided'],
      validate: {
        validator: (about) => {
          about = about.split(' ');

          return about.length <= 100;
        },
        message: 'About must have less than or equal to 100 words',
      },
    },
    requirements: {
      type: String,
      // required: [true, 'requirements must be provided'],
      validate: {
        validator: (about) => {
          about = about.split(' ');

          return about.length <= 100;
        },
        message: 'requirements must have less than or equal to 100 words',
      },
    },
    mode: {
      type: String,
      // required: [true, 'mode must be provided'],
      trim: true,
      // enum: ["online", "offline", "hybrid"],
      validate: {
        validator: function (value) {
          return ['online', 'offline', 'hybrid'].includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid mode, please use either 'online', 'offline' or 'hybrid'`,
      },
    },
    location: {
      type: String,
      // required: [true, 'location must be provided'],
      trim: true,
      maxlength: [20, 'location must be less than or equal to 20 characters'],
      minlength: [5, 'location must be greater than or equal to 5 characters'],
    },
    fee: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      // required: [true, 'language must be provided'],
      trim: true,
      maxlength: [20, 'language must be less than or equal to 20 characters'],
      minlength: [5, 'language must be greater than or equal to 5 characters'],
    },
  },
];
