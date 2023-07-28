const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name_of_company: {
      type: String,
      required: false,
      maxlength: 32,
      trim: true,
    },
    name: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phoneno: {
      type: Number,
      maxlength: 12,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    codechef: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    youtube: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    nature_of_offering: {
      type: String,
      trim: true,
    },
    selector: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    type_of_art: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) {
      return "";
    }
    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex");
    } catch {
      return "";
    }
  },
};

module.exports = mongoose.model("Patron", userSchema);
