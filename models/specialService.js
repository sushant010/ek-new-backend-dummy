const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const specialServiceSchema = mongoose.Schema(
  {
    role: {
      type: Number,
      default: 3,
    },
    compamyName: {
      type: String,
      required: [true, "Name must be provided"],
      trim: true,
      maxlength: [20, "Name must be less than or equal to 20 characters"],
      minlength: [5, "Name must be greater than or equal to 5 characters"],
    },
    contactTo: {
      type: String,
      required: [true, "contactTo must be provided"],
      trim: true,
      maxlength: [20, "contactTo must be less than or equal to 20 characters"],
      minlength: [5, "contactTo must be greater than or equal to 5 characters"],
    },
    location: {
      type: String,
      required: [true, "location must be provided"],
      trim: true,
      maxlength: [20, "location must be less than or equal to 20 characters"],
      minlength: [5, "location must be greater than or equal to 5 characters"],
    },
    phoneno: {
      type: Number,
      max: [9999999999, "phoneno must be of 10 digit"],
      min: [1000000000, "phoneno must be of 10 digit"],
    },
    email: {
      type: String,
      required: [true, "email address must be provided"],
      unique: true,
      validate: {
        validator: (createdBy) => {
          validator.isEmail(createdBy);
        },
        message: "Please provide a valid email address",
      },
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "gender must be provided"],
      trim: true,
      // enum: ["male", "female", "other"],
      validate: {
        validator: (gender) => {
          return ["male", "female", "other"].includes(gender);
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
          const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          return regex.test(url);
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, "password must be provided"],
      trim: true,
      maxlength: [20, "password must be less than or equal to 20 characters"],
      minlength: [5, "password must be greater than or equal to 5 characters"],
    },
    publishedCourses: [
      {
        select: false,
        _id: false,
        title: {
          type: String,
          required: [true, "title must be provided"],
          trim: true,
          maxlength: [20, "title must be less than or equal to 20 characters"],
          minlength: [5, "title must be greater than or equal to 5 characters"],
        },
        aboutCourse: {
          type: String,
          required: [true, "About must be provided"],
          validate: {
            validator: (about) => {
              about = about.split(" ");

              return about.length <= 100;
            },
            message: "About must have less than or equal to 100 words",
          },
        },
        aboutAgency: {
          type: String,
          required: [true, "About must be provided"],
          validate: {
            validator: (about) => {
              about = about.split(" ");

              return about.length <= 100;
            },
            message: "About must have less than or equal to 100 words",
          },
        },
        requirements: {
          type: String,
          required: [true, "requirements must be provided"],
          validate: {
            validator: (about) => {
              about = about.split(" ");

              return about.length <= 100;
            },
            message: "requirements must have less than or equal to 100 words",
          },
        },
        mode: {
          type: String,
          required: [true, "mode must be provided"],
          trim: true,
          // enum: ["online", "offline", "hybrid"],
          validate: {
            validator: function (value) {
              return ["online", "offline", "hybrid"].includes(value);
            },
            message: (props) => `${props.value} is not a valid mode, please use either 'online', 'offline' or 'hybrid'`,
          },
        },
        location: {
          type: String,
          required: [true, "location must be provided"],
          trim: true,
          maxlength: [20, "location must be less than or equal to 20 characters"],
          minlength: [5, "location must be greater than or equal to 5 characters"],
        },
        fee: {
          type: Number,
          default: 0,
        },
        language: {
          type: String,
          required: [true, "language must be provided"],
          trim: true,
          maxlength: [20, "language must be less than or equal to 20 characters"],
          minlength: [5, "language must be greater than or equal to 5 characters"],
        },
      },
    ],
  },
  { timestamps: true }
);

specialServiceSchema.virtual("totalCoursesPublished").get(function () {
  return this.publishedCourses.length;
});

specialServiceSchema.set("toJSON", { virtuals: true });

specialServiceSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

specialServiceSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

module.exports = mongoose.model("specialservices", specialServiceSchema);
