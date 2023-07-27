// const Hired = require('../models/hiredArtists');
const PatronComment = require('../models/patronComment');
const ArtistComment = require('../models/artistComment');
const User = require('../models/user');

const _ = require('lodash');

exports.getAllPtronComments = async (req, res) => {
  const email = req.params.patronEmail;

  if (!email) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:patronEmail!',
    });
  }

  const patron = await User.findOne({ email });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const comments = await ArtistComment.find({ patronId: patron.id });

  if (_.isEmpty(comments)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comments not found!',
    });
  }

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: comments,
  });
};

exports.makeCommentToArtist = async (req, res) => {
  const { patronEmail, artistEmail } = req.params;

  const comment = req.body.comment;

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide a comment!',
    });
  }

  if (!patronEmail || !artistEmail) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:patronEmail!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!artist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  // const hiredArtist = await Hired.findOne({
  //   hiredBy: patron._id,
  //   artistId: artist._id,
  // });

  // if (!hiredArtist) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Patron is not allowed to make a comment!',
  //   });
  // }

  // console.log({ patronId: patron.id, artistId: hiredArtist.artistId, comment });

  const newComment = await ArtistComment.create({
    patronId: patron.id,
    artistId: hiredArtist.artistId,
    comment,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
};

exports.deleteCommentToArtist = async (req, res) => {
  const { patronEmail, artistEmail, commentId } = req.params;

  if (!patronEmail || !artistEmail || !commentId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:patronEmail, /:artistId and /:commentId!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist not found!',
    });
  }

  const comment = await ArtistComment.findOneAndDelete({
    _id: commentId,
    patronId: patron._id,
    artistId: artist._id,
  });

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found or does not belongs to this artist!',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.updateCommentToArtist = async (req, res) => {
  const { patronEmail, artistEmail, commentId } = req.params;

  if (!patronEmail || !artistEmail || !commentId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:patronEmail, /:artistId and /:commentId!',
    });
  }

  const newComment = req.body.comment;

  if (!newComment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide comment!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist not found!',
    });
  }

  const comment = await ArtistComment.findOneAndUpdate(
    {
      _id: commentId,
      patronId: patron._id,
      artistId: artist._id,
    },
    {
      comment: req.body.comment,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found or does not belongs to this artist!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: comment,
  });
};

// artist -> patron

exports.getAllArtistComments = async (req, res) => {
  const email = req.params.artistEmail;

  if (!email) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:artistEmail!',
    });
  }

  const artist = await User.findOne({ email, role: 2 });

  // console.log(artist);

  if (!artist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist not found!',
    });
  }

  const comments = await PatronComment.find({ artistId: artist._id });

  if (_.isEmpty(comments)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comments not found!',
    });
  }

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: comments,
  });
};

exports.makeCommentToPatron = async (req, res) => {
  const { patronEmail, artistEmail } = req.params;

  const comment = req.body.comment;

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide a comment!',
    });
  }

  if (!patronEmail || !artistEmail) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:artistEmail and /:patronEmail!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!artist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  // const hiredArtist = await Hired.findOne({
  //   hiredBy: patron._id,
  //   artistId: artist._id,
  // });

  if (!hiredArtist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist is not allowed to make a comment!',
    });
  }

  // console.log({ patronId: patron.id, artistId: hiredArtist.artistId, comment });

  const newComment = await PatronComment.create({
    patronId: patron.id,
    artistId: hiredArtist.artistId,
    comment,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
    },
  });
};

exports.deleteCommentToPatron = async (req, res) => {
  const { patronEmail, artistEmail, commentId } = req.params;

  if (!patronEmail || !artistEmail || !commentId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:artistId, /:patronEmail and /:commentId!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist not found!',
    });
  }

  const comment = await PatronComment.findOneAndDelete({
    _id: commentId,
    patronId: patron._id,
    artistId: artist._id,
  });

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found or does not belongs to this patron!',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.updateCommentToPatron = async (req, res) => {
  const { patronEmail, artistEmail, commentId } = req.params;

  if (!patronEmail || !artistEmail || !commentId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide an /:artistId, /:patronEmailand /:commentId!',
    });
  }

  const newComment = req.body.comment;

  if (!newComment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide comment!',
    });
  }

  const patron = await User.findOne({ email: patronEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patron not found!',
    });
  }

  const artist = await User.findOne({ email: artistEmail });

  if (!patron) {
    return res.status(404).json({
      status: 'fail',
      message: 'Artist not found!',
    });
  }

  const comment = await PatronComment.findOneAndUpdate(
    {
      _id: commentId,
      patronId: patron._id,
      artistId: artist._id,
    },
    {
      comment: req.body.comment,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found or does not belongs to this artist!',
    });
  }

  res.status(200).json({
    status: 'success',
    data: comment,
  });
};
