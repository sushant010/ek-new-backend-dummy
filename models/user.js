const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      max: 9999999999,
      min: 1000000000,
    },
    email: {
      type: String,
      required: [true, 'email must be provided!'],
      unique: true,
      validate: {
        validator: (email) => {
          // console.log(validator.isEmail(email));
          return validator.isEmail(email);
        },
        message: 'Please provide a valid email address!',
      },
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    rating: [
      {
        _id: false,
        count: {
          type: Number,
          default: 0,
          validate: {
            validator: (rating) => {
              return rating <= 5 && rating >= 0;
            },
            message: (props) => {
              return `${props.value} is not a valid rating number, it must be less than or equal to 5!'`;
            },
          },
        },
        rateBy: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    artLover: {
      age: {
        type: Number,
      },
      gender: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: (gender) => {
            return ['Male', 'Female', 'Other'].includes(gender);
          },
          message: (props) => {
            return `${props.value} is not a valid gender, please use either 'Male', 'Female' or 'Other'`;
          },
        },
      },
      location: {
        type: String,
        trim: true,
        lowercase: true,
      },
      artCategory: {
        type: String,
        trim: true,
        lowercase: true,
      },
      link: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    patron: {
      name_of_company: {
        type: String,
        trim: true,
        default: '',
      },
      pname: {
        type: String,
        trim: true,
        default: '',
      },
      gender: {
        type: String,
        trim: true,
        default: '',
      },
      location: {
        type: String,
        trim: true,
        default: '',
      },
      phoneno: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
      },
      emailid: {
        type: String,
        trim: true,
        default: '',
      },
      website_link: {
        type: String,
        trim: true,
        default: '',
      },
      youtube_link: {
        type: String,
        trim: true,
        default: '',
      },
      instagram_link: {
        type: String,
        trim: true,
        default: '',
      },
      facebook_link: {
        type: String,
        trim: true,
        default: '',
      },
      nature_of_offering: {
        type: String,
        trim: true,
        default: '',
      },
      selector: {
        type: String,
        trim: true,
        default: '',
      },
      profession: {
        type: String,
        trim: true,
        default: '',
      },
      type_of_art: {
        type: String,
        trim: true,
        default: '',
      },
      category: {
        type: String,
        trim: true,
        default: '',
      },
    },
    artist: {
      fname: {
        type: String,
        trim: true,
        default: '',
      },
      lname: {
        type: String,
        trim: true,
        default: '',
      },
      phoneno: {
        type: Number,
        max: 9999999999,
        min: 1000000000,
      },
      emailid: {
        type: String,
        trim: true,
        default: '',
      },
      age: {
        type: Number,
        default: 0,
      },
      gender: {
        type: String,
        trim: true,
        default: 'Other',
      },
      caste: {
        type: 'String',
        trim: true,
        default: '',
      },
      religion: {
        type: String,
        trim: true,
        default: 'Other',
      },
      height: {
        type: Number,
        default: 0,
      },
      weight: {
        type: Number,
        default: 0,
      },
      location: {
        type: String,
        // required: [true, 'location must be provided'],
        trim: true,
        maxlength: [20, 'location must be less than or equal to 20 characters'],
        minlength: [
          5,
          'location must be greater than or equal to 5 characters',
        ],
      },
      language: {
        type: String,
        default: 'Other',
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      education: {
        type: String,
        trim: true,
        default: '',
      },
      videos: [
        {
          type: String,
          trim: true,
        },
      ],
      majorPerformance: {
        type: String,
        trim: true,
      },
      photograph: [
        {
          type: String,
          trim: true,
        },
      ],
      skills: [String],
      category: {
        type: String,
        trim: true,
        default: '',
      },
      experince: {
        type: String,
        trim: true,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
      photo: {
        data: Buffer,
        contentType: String,
      },
      youtubeLink: {
        type: String,
        trim: true,
        default: '',
      },
      instagramLink: {
        type: String,
        trim: true,
        default: '',
      },
      facebookLink: {
        type: String,
        trim: true,
        default: '',
      },
      levelOfPerformance: {
        type: String,
        trim: true,
        default: '',
      },
      artEducation: {
        type: String,
        trim: true,
        default: '',
      },
    },
    special_services: {
      companyName: {
        type: String,
        // required: [true, 'Name must be provided'],
        trim: true,
        maxlength: [20, 'Name must be less than or equal to 20 characters'],
        minlength: [5, 'Name must be greater than or equal to 5 characters'],
      },
      contactTo: {
        type: String,
        // required: [true, 'contactTo must be provided'],
        trim: true,
        maxlength: [
          20,
          'contactTo must be less than or equal to 20 characters',
        ],
        minlength: [
          5,
          'contactTo must be greater than or equal to 5 characters',
        ],
      },
      location: {
        type: String,
        // required: [true, 'location must be provided'],
        trim: true,
        maxlength: [20, 'location must be less than or equal to 20 characters'],
        minlength: [
          5,
          'location must be greater than or equal to 5 characters',
        ],
      },
      phoneno: {
        type: Number,
        max: [9999999999, 'phoneno must be of 10 digit'],
        min: [1000000000, 'phoneno must be of 10 digit'],
      },
      email: {
        type: String,
        // required: [true, 'email must be provided'],
        validate: {
          validator: (email) => {
            console.log(validator.isEmail(email));
            return validator.isEmail(email);
          },
          message: 'Please provide a valid email address!',
        },
        lowercase: true,
        trim: true,
      },
      gender: {
        type: String,
        // required: [true, 'gender must be provided'],
        trim: true,
        // enum: ["male", "female", "other"],
        validate: {
          validator: (gender) => {
            return ['male', 'female', 'other'].includes(gender);
          },
          message: (props) => {
            return `${props.value} is not a valid gender, please use either 'male', 'female' or 'other'`;
          },
        },
      },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function (url) {
            const regex =
              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            return regex.test(url);
          },
          message: (props) => `${props.value} is not a valid URL`,
        },
      },
    },
    role: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return [1, 2, 3, 4].includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid role, please provide either 1, 2, 3 or 4`,
      },
    },
    savedOpportunities: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Opportunity',
      },
    ],
    isRegistered: {
      type: Boolean,
      default: false,
    },
    appliedFor: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Opportunity',
      },
    ],
    communityJoined: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'JoinedUser',
      },
    ],
    //role 1 for patron
    //role 2 for artists
    //role 3 for special service
  },
  { timestamps: true }
);

userSchema.virtual('avgRating').get(function () {
  let sum = 0;
  this.rating.forEach((rate) => {
    sum += rate.count;
  });
  const avg = sum / this.rating.length;
  return avg;
});

userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  if (user.role === 0) {
    for (let field in userObject) {
      if (field != 'email' && field != 'role') {
        delete userObject[field];
      }
    }
  }

  if (user.role === 1) {
    delete userObject.artist;
    delete userObject.artLover;
    delete userObject.special_services;
  }

  if (user.role === 2) {
    delete userObject.patron;
    delete userObject.artLover;
    delete userObject.special_services;
  }

  if (user.role === 3) {
    delete userObject.artist;
    delete userObject.patron;
    delete userObject.artLover;
  }

  if (user.role === 4) {
    delete userObject.artist;
    delete userObject.patron;
    delete userObject.special_services;
  }

  return userObject;
};

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcryptjs.compare(candidatePass, userPass);
};

module.exports = mongoose.model('User', userSchema);
