const multer = require('multer');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const Image = require('../models/imageModel');
const sharp = require('sharp');
// Patron and artist profile image (completed)
// Artist upload audio, video
// Artist patron upload documents
// Patron upload  company image

// profile-image-name = profile-userId-time.ext

const storageEngine = multer.diskStorage({
  destination: 'client/public/assets/avatar',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const checkFileType = async (file, cb) => {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png/;

  //check extension names

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb(new Error('You can Only Upload Images!'), false);
  }
};

exports.upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

exports.uploadProfileImg = async (req, res, next) => {
  // console.log(req.file);
  if (!req.file) {
    res.status(400).json({
      status: 'fail',
      message: 'Unable to upload image! Please upload a valid image.',
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    avatar: req.file.filename,
  });

  res.status(200).json({
    status: 'success',
    message: 'Avatar uploaded successfully!',
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/client/public/assets/website`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]
    );
  },
});

exports.uploadAdmin = multer({ storage: storage });

exports.uploadImageAdmin = async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide a image category.',
    });
  }

  if (!req.file) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an image.',
    });
  }

  const uploaded_images = await Image.create({
    name: req.file.filename,
    category,
  });

  res.status(201).json(uploaded_images);
};

exports.getAdminUploadedImgs = async (req, res) => {
  const images = await Image.find({});

  res.status(200).json({
    status: 'success',
    result: images.length,
    data: images,
  });
};

exports.getProfileImg = async (req, res) => {};

exports.delProfileImg = async (req, res) => {};
