const UserQuery = require('../models/userQuery');

exports.postQuery = async (req, res) => {
  const { name, contactNumber, emailId, location, query } = req.body;

  if (!name || !contactNumber || !emailId || !location || !query) {
    return res.status(200).json({
      status: 'success',
      message: 'Please provide name, contactNumber, emailId, location, query',
    });
  }

  await UserQuery.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Query posted!',
  });
};

exports.queriesPosted = async (req, res) => {
  const queries = await UserQuery.find({});

  res.status(200).json({
    status: 'success',
    results: queries.length,
    data: queries,
  });
};
