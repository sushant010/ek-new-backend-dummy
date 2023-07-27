const _ = require("lodash");
const jwt = require("jsonwebtoken");
const SpeServ = require("../models/specialService");

exports.signup = async (req, res) => {
  const data = {
    compamyName: req.body.compamyName,
    contactTo: req.body.contactTo,
    location: req.body.location,
    phoneno: req.body.phoneno,
    email: req.body.email,
    gender: req.body.gender,
    website: req.body.website,
    password: req.body.password,
  };

  try {
    const user = await SpeServ.create(data);

    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      const message = errors.join(". ");
      return res.status(400).json({
        status: "fail",
        message: message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "User already exist with this email!",
      });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      status: "fail",
      message: "Please provide email and password!",
    });
  }

  const user = await SpeServ.findOne({ email }).select("+password");

  if (_.isEmpty(user)) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password!",
    });
  }

  if (!(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password!",
    });
  }

  const token = jwt.sign({ _id: user._id }, "shhhhh");

  res.cookie("token", token, { expire: new Date() + 9999 });

  res.status(200).json({
    status: "success",
    data: { token },
  });
};

exports.getUser = async (req, res) => {
  const email = req.params.email;

  if (_.isEmpty(email)) {
    return res.status(401).json({
      status: "fail",
      message: "Please provide an email address!",
    });
  }

  const user = await SpeServ.findOne({ email });

  if (_.isEmpty(user)) {
    return res.status(404).json({
      status: "fail",
      message: "User not found!",
    });
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
};

exports.publishCourse = async (req, res) => {
  const data = {
    title: req.body.title,
    aboutCourse: req.body.aboutCourse,
    aboutAgency: req.body.aboutAgency,
    requirements: req.body.requirements,
    mode: req.body.mode,
    location: req.body.location,
    fee: req.body.fee,
    language: req.body.language,
  };

  const email = req.params.email;

  if (_.isEmpty(email)) {
    return res.status(401).json({
      status: "fail",
      message: "Please provide an email address!",
    });
  }
  try {
    const user = await SpeServ.findOneAndUpdate({ email }, { $addToSet: { publishedCourses: data } }, { new: true, runValidators: true }).select("+publishedCourse");

    if (_.isEmpty(user)) {
      return res.status(404).json({
        status: "fail",
        message: "User not found!",
      });
    }

    res.status(200).json({
      status: "success",
      data: user.publishedCourses[user.publishedCourses.length - 1],
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      const message = errors.join(". ");
      return res.status(400).json({
        status: "fail",
        message: message,
      });
    }
  }
};
