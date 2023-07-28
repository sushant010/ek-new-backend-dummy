const User = require('../models/user');
const Otp = require('../models/otp');
// const Email = require('../utils/email.js');
const multer = require('multer');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ArtistComment = require('../models/artistComment');
const PatronComment = require('../models/patronComment');
const Opportunity = require('../models/opportunity');
const Applied = require('../models/appliedArtist');

require('../package');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

exports.upload = multer({ storage: storage });

exports.getUserById = (req, res, next, id) => {
  req.profile = 0;
  // console.log(id);
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      // console.log(user);
      return res.status(400).json({
        error: 'No user was found in DB BY ID',
      });
    }
    // console.log(user);

    req.profile = user;
    next();
  });
};

// exports.getUserByEmail = (req, res, next, id) => {
//   User.find({ email: id, role: 0, isRegistered: true }).exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: 'No user was found in DB BY ID',
//       });
//     }

//     req.profile = user;
//     next();
//   });
// };
exports.getuserDetailByID = async (req, res, next) => {
  const _id = req.params.userid;

  const user = await User.findById({ _id }).select('savedOpportunities');
  res.json(user);
};

//*******************USER***********************//

exports.getArtistById = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Applied.findById(id).populate({ path: 'artist' });

    if (!artist) {
      res.status(404).json({
        status: 'fail',
        message: 'Artist application not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        artist: artist.artist,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid _id',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'Something went worong!',
    });
  }
};

exports.getUser = async (req, res) => {
  req.user.savedOpportunities = undefined;
  req.user.appliedFor = undefined;
  req.user.communityJoined = undefined;
  req.user.rating = undefined;

  // console.log(req.user);

  if (req.user.role === 0) {
    try {
      const user = await User.findById(req.params.id);

      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid _id',
        });
      }

      res.status(500).json({
        status: 'fail',
        message: 'Something went worong!',
      });
    }
  }

  res.status(200).json(req.user);
};

exports.updateUser = async (req, res) => {
  let user, id, role;

  if (req.user.role === 0) {
    if (req.params.id) {
      id = req.params.id;
      try {
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).json({
            status: 'fail',
            message: 'User not found!',
          });
        }
        role = user.role;
      } catch (error) {
        res.status(error);
      }
    }
  } else {
    id = req.user.id;
    role = req.user.role;
  }

  // console.log(role);

  try {
    switch (role) {
      case 1:
        user = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              name: req.body.name,
              middleName: req.body.middleName,
              lastName: req.body.lastName,
              phoneNumber: req.body.phoneNumber,
              'patron.name_of_company': req.body?.name_of_company,
              'patron.pname': req.body?.pname,
              'patron.gender': req.body?.gender,
              'patron.location': req.body?.location,
              'patron.phoneno': req.body?.phoneno,
              'patron.emailid': req.body?.emailid,
              'patron.website_link': req.body?.website_link,
              'patron.youtube_link': req.body?.youtube_link,
              'patron.instagram_link': req.body?.instagram_link,
              'patron.facebook_link': req.body?.facebook_link,
              'patron.nature_of_offering': req.body?.nature_of_offering,
              'patron.selector': req.body?.selector,
              'patron.profession': req.body?.profession,
              'patron.type_of_art': req.body?.type_of_art,
              'patron.category': req.body?.category,
            },
          },
          {
            new: true,
          }
        );
        break;

      case 2:
        user = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              name: req.body.name,
              middleName: req.body.middleName,
              lastName: req.body.lastName,
              phoneNumber: req.body.phoneNumber,
              'artist.fname': req.body?.name,
              'artist.lname': req.body?.lastName,
              'artist.phoneno': req.body?.phoneno,
              'artist.emailid': req.body?.emailid,
              'artist.age': req.body?.age,
              'artist.emailid': req.body?.emailid,
              'artist.gender': req.body?.gender,
              'artist.caste': req.body?.caste,
              'artist.religion': req.body?.religion,
              'artist.height': req.body?.height,
              'artist.weight': req.body?.weight,
              'artist.language': req.body?.language,
              'artist.location': req.body?.location,
              'artist.state': req.body?.state,
              'artist.education': req.body?.education,
              'artist.videos': req.body?.videos,
              'artist.majorPerformance': req.body?.majorPerformance,
              'artist.photograph': req.body?.photograph,
              'artist.skills': req.body?.skills,
              'artist.category': req.body?.category,
              'artist.experince': req.body?.experince,
              'artist.url': req.body?.url,
              'artist.youtubeLink': req.body?.youtubeLink,
              'artist.instagramLink': req.body?.instagramLink,
              'artist.facebookLink': req.body?.facebookLink,
              'artist.levelOfPerformance': req.body?.levelOfPerformance,
              'artist.artEducation': req.body?.artEducation,
            },
          },
          {
            new: true,
          }
        );
        break;

      case 3:
        user = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              'special_services.companyName': req.body?.companyName,
              'special_services.contactTo': req.body?.contactTo,
              'special_services.location': req.body?.location,
              'special_services.phoneno': req.body?.phoneno,
              'special_services.email': req.body?.email,
              'special_services.gender': req.body?.gender,
              'special_services.website': req.body?.website,
            },
          },
          {
            new: true,
          }
        );
        break;

      case 4:
        user = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              'artLover.age': req.body?.age,
              'artLover.gender': req.body?.gender,
              'artLover.location': req.body?.location,
              'artLover.artCategory': req.body?.artCategory,
              'artLover.link': req.body?.link,
            },
          },
          {
            new: true,
          }
        );
        break;

      default:
        break;
    }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//*******************USER***********************//

exports.getByEmail = async (req, res) => {
  req.profile[0].salt = undefined;
  req.profile[0].encry_password = undefined;
  req.profile[0].createdAt = undefined;
  req.profile[0].updatedAt = undefined;
  req.profile[0].patron = undefined;
  req.profile[0].isRegistered = false;
};

//Controller for artist registration
exports.registerUser = (req, res) => {
  let obj;
  if (req.file) {
    obj = {
      photo: {
        data: fs.readFileSync(
          require.resolve('../uploads/' + req.file.filename),
          { encoding: 'utf8' }
        ),
        contentType: 'image/jpg',
      },
    };
    req.body.photo = obj.photo;
  }

  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { artist: req.body, isRegistered: true },
    { new: true, useFindAndModify: true },
    (err, user) => {
      if (err) {
        // console.log("eeee", err);
        return res.status(400).json({
          error: 'You are not authorized to update this.',
        });
      }
      if (req.file) {
        user.artist.photo = obj.photo;
      }

      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;

      res.json(user);
    }
  );
};

exports.updateSpecialService = async (req, res) => {
  const update = req.body;
  const email = req.params.email;

  if (_.isEmpty(update)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Nothing to update!',
    });
  }

  if (_.isEmpty(email)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an email address!',
    });
  }

  const user = await User.findOneAndUpdate(
    { email, role: 3 },
    {
      special_services: { ...update },
    },
    {
      new: true,
    }
  );

  if (_.isEmpty(user)) {
    return res.status(400).json({
      status: 'fail',
      message: 'User not found!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

//controller for updating patron
exports.updatePatron = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to update this.',
        });
      }
      user.salt = undefined;
      user.password = undefined;
      res.json(user);
    }
  );
};

//controller for registering patron
exports.registerPatron = (req, res) => {
  // let filter={patron:req.body}
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { patron: req.body, isRegistered: true },
    { new: true, useFindAndModify: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to update this.',
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

//get patron details
exports.getPatron = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.getUserByFilter = (req, res) => {
  console.log(req.body);
  User.find(req.body).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'No Record found By Filter',
      });
    }

    return res.json(user);
  });
};

//added by Gokul Suthar
exports.getAllUsers = async (req, res) => {
  const role = req.body.role;

  if (!role) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide role!',
    });
  }

  const users = await User.find({ role });

  if (users === []) {
    return res.status(404).json({
      status: 'success',
      message: 'There is no user found on the server!',
    });
  }
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: users,
  });
};

exports.getAllOpp = async (req, res) => {
  const users = await Opportunity.find({});

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: users,
  });
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.emailId;

  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide an email address!',
    });
  }

  const user = await User.findOne({ email });

  if (_.isEmpty(user)) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found with this email address!',
    });
  }

  let comments = [];

  if (user.role === 2) {
    comments = await ArtistComment.find({ patronId: user._id });
  } else if (user.role === 1) {
    comments = await PatronComment.find({ patronId: user._id });
  }

  res.status(200).json({
    status: 'success',
    data: { user, comments },
  });
};

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(200).json({
      status: 'fail',
      message: 'Please provide an email address!',
    });
  }

  const user = await User.findOne({ email });

  if (_.isEmpty(user)) {
    return res.status(200).json({
      status: 'fail',
      message: 'There is no user found with this email address!',
    });
  }

  const otpObject = {
    otp: Math.floor(1000 + Math.random() * 9000),
    expirationTime: new Date().getTime() + 10 * 60000,
    userId: user._id,
  };

  const otp = await Otp.create(otpObject);

  try {
    await new Email(user.email, otp.otp).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Otp sent to email!',
    });
  } catch (error) {
    console.log(error);

    await Otp.findOneAndDelete(otp.id);

    res.status(500).json({
      status: 'fail',
      message: 'There was an error sending the email. Try again later!!',
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { otp, email, newPassword, confirmNewPassword } = req.body;

  if (!otp || !email || !newPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide an OTP, email address and newPassword!',
    });
  }

  const code = await Otp.findOne({ otp });

  if (!code) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid OTP or has been expired!',
    });
  }

  const user = await User.findOne({
    email,
    id: code.userId,
  });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found!',
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(404).json({
      status: 'fail',
      message: 'newPassword and confirmNewPassword does not match!',
    });
  }

  user.password = req.body.newPassword;

  await user.save({ validateBeforeSave: false });

  await Otp.findOneAndDelete({ otp, userId: user.id });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.recentlyAppliedOpp = async (req, res) => {
  if (_.isEmpty(req.params.email)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an email id!',
    });
  }

  const user = await User.findOne({ email: req.params.email }).populate({
    path: 'appliedFor',
  });

  if (_.isEmpty(user.appliedFor)) {
    return res.status(404).json({
      status: 'fail',
      message: 'You have not applied for any opportunity!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: [
      user.appliedFor[user.appliedFor.length - 1],
      user.appliedFor[user.appliedFor.length - 2],
    ],
  });
};

exports.getSavedOpp = async (req, res) => {
  const email = req.params.emailId;

  if (_.isEmpty(email)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an email address!',
    });
  }

  const user = await User.findOne({ email }).populate({
    path: 'savedOpportunities',
  });

  if (_.isEmpty(user)) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found!',
    });
  }

  if (user.savedOpportunities.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Saved Opportunities not found!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: user.savedOpportunities,
  });
};

// rate
exports.rateArtist = async (req, res) => {
  const { artistId } = req.query;

  // console.log(artistId);

  if (!artistId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide artistId!',
    });
  }

  try {
    const artist = await User.findById(artistId);

    if (!artist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Artist not found!',
      });
    }

    // const isHired = await Hired.findOne({
    //   hiredBy: req.user.id,
    //   artistId: artist.id,
    // });

    // if (!isHired) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     data: 'Not allowed to rate!',
    //   });
    // }

    artist.rating.push({
      count: req.body.rating,
      rateBy: req.user.id,
    });

    await artist.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        name: artist.name,
        rating: req.body.rating,
      },
    });
  } catch (error) {
    // console.log(error.name);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid _id',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'Something went worong!',
    });
  }
};

exports.ratePatron = async (req, res) => {
  const { patronId } = req.query;

  // console.log(artistId);

  if (!patronId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide patronId!',
    });
  }

  try {
    const patron = await User.findById(patronId);

    if (!patron) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patron not found!',
      });
    }

    // const isHired = await Hired.findOne({
    //   hiredBy: patron.id,
    //   artistId: req.user.id,
    // });

    // if (!isHired) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     data: 'Not allowed to rate!',
    //   });
    // }

    patron.rating.push({
      count: req.body.rating,
      rateBy: req.user.id,
    });

    await patron.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        name: patron.name,
        rating: req.body.rating,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid _id',
      });
    }

    // console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Something went worong!',
    });
  }
};

exports.topArtists = async (req, res) => {
  // const artists = await User.find({ avgRating: { $gt: 4 } }).limit(5);
  let artists = await User.find(
    { role: 2 },
    {
      'artist.fname': 1,
      'artist.category': 1,
      'artist.experince': 1,
      'artist.levelOfPerformance': 1,
    }
  ).limit(5);

  artists = artists.map((artist) => {
    return { ...artist.artist, _id: artist.id };
  });

  res.status(200).json({
    status: 'success',
    data: artists,
  });
};
