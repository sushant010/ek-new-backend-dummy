const Join = require('../models/join');
const path = require('path');

// const { sendMail } = require('../utils/email');

const Email = require('../utils/email');

exports.join = async (req, res) => {
  const required_fields = [
    'full_name',
    'location',
    'email',
    'phone_number',
    'message',
    'link',
    'subject',
    'organization',
  ];

  try {
    const join = await Join.create(req.body);

    const adminMailSended = Email.sendJoinUsMailToAdmin(join);
    const userMailSended = Email.sendJoinUsMailToUser(
      join.full_name,
      join.email
    );

    if (!adminMailSended && !userMailSended) {
      await Join.findByIdAndDelete(join._id);

      res.status(500).json({
        status: 'fail',
        message: 'Unable to create join.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: join,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      required_fields.find((field) => {
        if (error?.errors?.[field]) {
          return res.status(400).json({
            status: 'fail',
            message: error?.errors?.[field]?.properties?.message,
          });
        }
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        messsage: 'Email adress already in use.',
      });
    } else {
      res.status(500).json({
        status: 'fail',
        messsage: 'Something went wrong.',
      });
    }

    console.log(error);
  }
};

exports.getAllJoins = async (req, res) => {
  const allJoins = await Join.find({});

  res.status(200).json({
    status: 'success',
    result: allJoins.length,
    data: allJoins,
  });
};

exports.getJoinById = async (req, res) => {
  const { id } = req.params;

  try {
    const join = await Join.findById(id);

    res.status(200).json({
      status: 'success',
      data: join,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        messsage: 'Invalid _id.',
      });
    }

    res.status(500).json({
      status: 'fail',
      messsage: 'Something went wrong.',
    });
  }
};
