const User = require('../models/user');
const _ = require('lodash');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const SpeServ = require('../models/specialService');
require('dotenv').config();

exports.signout = (req, res) => {
  res.clearCookie('token');

  res.json({
    message: 'User Sign Out Successfull',
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      status: 'fail',
      message: 'Please provide email and password!',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  // console.log(user);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found!',
    });
  }

  if (user === {} || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password!',
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };

  res.cookie('jwt', token, cookieOptions);

  // res.json({ token, user });
  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
  });
};

exports.signup = async (req, res) => {
  const data = Object.keys(req.body);

  const requiredFields = [
    'name',
    'lastName',
    'phoneNumber',
    'email',
    'password',
    'role',
  ];

  let missing;

  const haveReqField = requiredFields.every((field) => {
    if (!data.includes(field)) {
      missing = field;
      return false;
    } else {
      return true;
    }
  });

  if (!haveReqField) {
    return res.status(400).json({
      status: 'fail',
      message: `${missing} must be provided!`,
    });
  }

  try {
    const { _id, name, email } = await User.create({
      name: req.body.name,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    // const users = await User.create(req.body);

    // res.status(201).json(users);

    res.status(201).json({
      status: 'success',
      data: {
        _id,
        name,
        email,
      },
    });
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'User already exist with this email!',
      });
    }

    if ('ValidationError' === error.name) {
      return res.status(403).json({
        status: 'fail',
        message: error.message.split(':')[2].trim(),
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong! Unable to create user!',
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    !_.isEmpty(req.headers.authorization) &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (_.isEmpty(token)) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please login to get acesss.',
    });
  }

  try {
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decode._id).populate({
      path: 'savedOpportunities',
    });

    if (_.isEmpty(user)) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found with this token!',
      });
    }

    // if (user.verified === false) {
    //   return next(
    //     new AppError(
    //       'Email have not been verified yet! Please verify it first.',
    //       401
    //     )
    //   );
    // }

    // if (_.isEmpty(user)) {
    //   return next(
    //     new AppError(
    //       'The user belonging to this token does no longer exist!',
    //       401
    //     )
    //   );
    // }

    req.user = user;

    next();
  } catch (error) {
    // console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token!',
      });
    }
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action!',
      });
    }
    next();
  };
};
