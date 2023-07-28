const _ = require('lodash');
const Community = require('../models/community');
const User = require('../models/user');
const JoinedUser = require('../models/joinedUsers');

exports.createACommunity = async (req, res) => {
  const data = Object.keys(req.body);

  const requiredFields = [
    'name',
    'about',
    'sector',
    'minAge',
    'art',
    'limit',
    'expertise',
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
    const data = {
      name: req.body.name,
      about: req.body.about,
      sector: req.body.sector,
      minAge: req.body.minAge,
      art: req.body.art,
      limit: req.body.limit,
      expertise: req.body.expertise,
      createdBy: req.user.email,
    };

    const community = await Community.create(data);

    res.status(201).json({
      status: 'success',
      data: community,
    });
  } catch (error) {
    // console.log(error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((el) => el.message);
      const message = errors.join('. ');
      return res.status(400).json({
        status: 'fail',
        message: message,
      });
    }
  }
};

exports.getCommunityById = async (req, res) => {
  const id = req.params.id;

  try {
    const community = await Community.findOne({
      _id: id,
      createdBy: req.user.email,
    });

    if (_.isEmpty(community)) {
      return res.status(404).json({
        status: 'fail',
        message: `Community not found or may be it does not belongs to you!`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: community,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      return res.status(500).json({
        status: 'error',
        message,
      });
    }
  }
};

exports.getAllCommunities = async (req, res) => {
  const communities = await Community.find({});

  if (_.isEmpty(communities)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found!',
    });
  }

  res.status(200).json({
    status: 'success',
    result: communities.length,
    data: communities,
  });
};

exports.joinACommunity = async (req, res) => {
  const { id } = req.params;

  try {
    let community = await Community.findOne({
      _id: id,
      createdBy: { $ne: req.user.email },
    });

    if (!community) {
      return res.status(404).json({
        status: 'fail',
        message: 'Community not found!',
      });
    }

    if (community.limit === community.totalJoinedMembers) {
      return res.status(401).json({
        status: 'fail',
        message: 'Community is full!',
      });
    }

    const joinedData = {
      artist: req.user.id,
      community: id,
    };

    const joinedUser = await JoinedUser.findOneAndUpdate(
      joinedData,
      joinedData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    if (joinedUser?.isJoined === false) {
      community = await Community.findByIdAndUpdate(
        id,
        {
          $addToSet: { joinedBy: joinedUser?.id },
          $inc: { totalJoinedMembers: 1 },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      joinedUser.isJoined = true;
      await joinedUser.save({ validateBeforeSave: false });
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { communityJoined: joinedUser.id },
      });
    }

    res.status(200).json({
      status: 'success',
      data: community,
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'CastError') {
      return res.status(500).json({
        status: 'fail',
        message: 'Invalid _id!',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }
};

exports.leaveACommunity = async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;

  const user = await User.findOne({ email });

  if (_.isEmpty(user)) {
    return res.status(404).json({
      status: 'fail',
      message: `User not found by this '${email}' email!`,
    });
  }

  let community;

  try {
    community = await Community.findById(id);

    if (_.isEmpty(community)) {
      return res.status(404).json({
        status: 'fail',
        message: `Community not found by this '${id}' id!`,
      });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      return res.status(500).json({
        status: 'error',
        message,
      });
    }
  }

  let isJoined = false;

  for (const index in community.joinedBy) {
    if (user.id == community.joinedBy[index]) {
      isJoined = true;
      break;
    }
    isJoined = false;
  }

  if (!isJoined) {
    return res.status(400).json({
      status: 'fail',
      message: "You haven't joined the community!",
    });
  }

  const index = community.joinedBy.indexOf(user.id);

  if (index > -1) {
    community.joinedBy.splice(index, 1);
    community.totalJoinedMembers = community.totalJoinedMembers - 1;
    await community.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    stutus: 'success',
    data: community,
  });
};

exports.getJoinedMembers = async (req, res) => {
  const { id } = req.params;

  try {
    let communities = await JoinedUser.find({
      community: id,
      isJoined: true,
    }).populate('user');

    // console.log(community);

    if (!communities) {
      return res.status(404).json({
        status: 'fail',
        message: 'Community not found!',
      });
    }

    communities = communities.map((community) => {
      return community.user;
    });

    res.status(200).json({
      status: 'success',
      result: communities.length,
      data: communities,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.search = async (req, res) => {
  const query = req.params.query;

  const communities = await Community.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { sector: { $regex: query, $options: 'i' } },
      { subGroup: { $regex: query, $options: 'i' } },
      { art: { $regex: query, $options: 'i' } },
      { expertise: { $regex: query, $options: 'i' } },
    ],
  });

  res.status(200).json({
    status: 'success',
    result: communities.length,
    data: communities,
  });
};
