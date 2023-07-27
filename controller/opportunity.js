const Opportunity = require('../models/opportunity');
const User = require('../models/user');
const Applied = require('../models/appliedArtist');
// const Hired = require('../models/hiredArtists');
const _ = require('lodash');
const user = require('../models/user');
user.find({ $lt: { createdAt: new Date('2023-04-01') } });
//middleware for getting all record by email of patron
exports.getEmailId = (req, res, next, id) => {
  Opportunity.find({ posted_by_email: id }).exec((err, user) => {
    // console.log(user);
    if (err || !user) {
      return res.status(400).json({
        error: 'No user was found in DB BY ID',
      });
    }

    req.profile = user;
    next();
  });
};

//all opportunities posted by the patron
exports.getAllOpportunity = async (req, res) => {
  const opportunities = await Opportunity.find({
    posted_by_email: req.user.email,
  });

  res.status(200).json({
    status: 'success',
    results: opportunities.length,
    data: opportunities,
  });
};

//middlware for getting opportunity by opportunity id
exports.getOpportunityId = (req, res, next, id) => {
  Opportunity.findById(id).exec((err, result) => {
    if (err || !result) {
      return res.status(404).json({
        status: 'fail',
        message: 'Opportunity not found!',
      });
    }

    req.profile = result;
    next();
  });
};

//create opportunity by patron
exports.createOpportunity = async (req, res) => {
  const data = Object.keys(req.body);

  const requiredFields = [
    'position',
    'about',
    'requirements',
    'duration',
    'number',
    'budget',
    'type',
    'language',
    'mode',
    'location',
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
    const opportuity = await Opportunity.create({
      position: req.body.position,
      about: req.body.about,
      requirements: req.body.requirements,
      duration: req.body.duration,
      number: req.body.number,
      budget: req.body.budget,
      type: req.body.type,
      language: req.body.language,
      mode: req.body.mode,
      location: req.body.location,
      posted_by_email: req.user.email,
      link_of_document: req.body?.link_of_document,
    });

    res.status(201).json({
      status: 'success',
      data: opportuity,
    });
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'Opportunity already exist with this position!',
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

exports.updateOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    const opportuity = await Opportunity.findOneAndUpdate(
      {
        _id: id,
        posted_by_email: req.user.email,
      },
      {
        position: req.body?.position,
        about: req.body?.about,
        requirements: req.body?.requirements,
        duration: req.body?.duration,
        number: req.body?.number,
        budget: req.body?.budget,
        type: req.body?.type,
        language: req.body?.language,
        mode: req.body?.mode,
        location: req.body?.location,
        link_of_document: req.body?.link_of_document,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!opportuity) {
      return res.status(404).json({
        status: 'fail',
        message: "Opportunity not found or may be it doesn't belongs to you!",
      });
    }

    res.status(200).json({
      status: 'success',
      data: opportuity,
    });
  } catch (error) {
    // res.status(500).json(error);
    if (error.name === 'CastError') {
      return res.status(500).json({
        status: 'fail',
        message: 'Invalid _id!',
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
      message: 'Something went wrong!',
    });
  }
};

exports.removeOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    let opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        status: 'fail',
        message: 'Opportunity not found!',
      });
    }

    const applied = await Applied.findOneAndDelete({
      artist: req.user.id,
      opportunity: id,
      isShortListed: false,
    });

    if (opportunity.appliedBy.includes(applied?.id)) {
      opportunity = await Opportunity.findByIdAndUpdate(
        { _id: id },
        {
          $pull: { appliedBy: applied?.id },
          $inc: { totalApplication: -1 },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await User.findByIdAndUpdate(req.user.id, {
        $pull: { appliedFor: applied?.id },
      });
    }

    res.status(200).json({
      status: 'success',
      data: opportunity,
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

// Apply Opportunity
// exports.applyOpportunity = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const haveApplied = await Applied.findOne({
//       artist: req.user.id,
//       opportunity: id,
//     });

//     if (haveApplied) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Artist have already applied for this opportunity!',
//       });
//     }

//     const opportunity = await Opportunity.findById(id);

//     if (!opportunity) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Opportunity not found!',
//       });
//     }

//     const applied = await Applied.create({
//       artist: req.user.id,
//       opportunity: opportunity.id,
//     });

//     opportunity.appliedBy.push(applied.id);

//     // console.log(opportunity);
//     await opportunity.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: 'success',
//       data: opportunity,
//     });
//   } catch (error) {
//     // res.json(error);
//     if (error.name === 'CastError') {
//       return res.status(500).json({
//         status: 'fail',
//         message: 'Invalid _id!',
//       });
//     }

//     res.status(500).json({
//       status: 'fail',
//       message: 'Something went wrong!',
//     });
//   }
// };
exports.applyOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    let opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        status: 'fail',
        message: 'Opportunity not found!',
      });
    }

    const appliedData = {
      artist: req.user.id,
      opportunity: id,
    };

    const applied = await Applied.findOneAndUpdate(appliedData, appliedData, {
      upsert: true,
      new: true,
      runValidators: true,
    });

    if (!applied.isShortListed) {
      opportunity = await Opportunity.findByIdAndUpdate(
        { _id: id },
        {
          $addToSet: { appliedBy: applied.id },
          $inc: { totalApplication: 1 },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { appliedFor: applied.id },
      });
    }

    res.status(200).json({
      status: 'success',
      data: opportunity,
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

exports.patronOpportunities = async (req, res) => {
  const opportunities = await Opportunity.find(
    {
      posted_by_email: req.user.email,
    },
    { shortlisted: 0, hired: 0, rejected: 0, applied_by: 0 }
  ).sort({ createdAt: '-1' });

  res.status(200).json({
    status: 'success',
    results: opportunities.length,
    data: opportunities,
  });
};

exports.getAllOpportunities = async (req, res) => {
  let opportunities = await Opportunity.find({}).sort({ createdAt: '-1' });

  // const appliedOpp = await Applied.find({ artist: req.user.id });

  // opportunities = opportunities.map((opp) => {
  //   console.log(appliedOpp.includes(opp._id));
  //   if (!appliedOpp.includes(opp.id)) {
  //     return opp;
  //   }
  // });

  res.status(200).json({
    status: 'success',
    results: opportunities.length,
    data: opportunities,
  });
};

exports.shortListAnArtist = async (req, res) => {
  // const { opportuityId, applicationId } = req.params;

  // try {
  //   const application = await Applied.findOne({
  //     _id: applicationId,
  //     opportunity: opportuityId,
  //   });

  //   console.log(application);

  //   let opportunity;

  //   if (application?.isShortListed === false) {
  //     opportunity = await Opportunity.findOneAndUpdate(
  //       {
  //         id: application?.opportunity,
  //         posted_by_email: req.user.email,
  //       },
  //       {
  //         $pull: { appliedBy: application?._id },
  //         $addToSet: { shortListed: application?._id },
  //         // $set: { totalApplication: '$totalApplication' + 0 },
  //       },
  //       {
  //         new: true,
  //       }
  //     );

  //     if (!opportunity) {
  //       return res.status(404).json({
  //         status: 'fail',
  //         message: 'Opportunity not found!',
  //       });
  //     }

  //     application.isShortListed = true;
  //     await application.save({ validateBeforeSave: false });

  //     return res.status(200).json({
  //       status: 'success',
  //       data: opportunity,
  //     });
  //   }

  //   opportunity = await Opportunity.findOne({
  //     id: application?.opportuity,
  //     posted_by_email: req.user.email,
  //   });

  //   res.status(200).json({
  //     status: 'success',
  //     data: opportunity,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   if (error.name === 'CastError') {
  //     return res.status(500).json({
  //       status: 'fail',
  //       message: 'Invalid _id!',
  //     });
  //   }

  //   res.status(500).json({
  //     status: 'fail',
  //     message: 'Something went wrong!',
  //   });
  // }

  const { opportunityId, applicationId } = req.params;

  try {
    const application = await Applied.findOneAndUpdate(
      {
        opportunity: opportunityId,
        _id: applicationId,
        isRejected: false,
        isHired: false,
      },
      {
        $set: {
          isShortListed: true,
        },
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application not found!',
      });
    }

    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityId, posted_by_email: req.user.email },
      {
        $pull: { appliedBy: application?._id },
        $addToSet: { shortListed: application?._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: opportunity,
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

exports.hireAnArtist = async (req, res) => {
  // const { id, artistId } = req.params;

  // try {
  //   const application = await Applied.findOneAndUpdate(
  //     {
  //       artist: artistId,
  //       opportunity: id,
  //       isShortListed: true,
  //     },
  //     {
  //       $set: { isHired: true },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   let opportunity;

  //   opportunity = await Opportunity.findOneAndUpdate(
  //     {
  //       id: application?.id,
  //       posted_by_email: req.user.email,
  //     },
  //     {
  //       $pull: { shortListed: application?.id },
  //       $addToSet: { hired: application?.id },
  //       // $set: { totalApplication: '$totalApplication' + 0 },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   if (!opportunity) {
  //     opportunity = await Opportunity.findOne({
  //       id: application?.id,
  //       posted_by_email: req.user.email,
  //     });
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: opportunity,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   if (error.name === 'CastError') {
  //     return res.status(500).json({
  //       status: 'fail',
  //       message: 'Invalid _id!',
  //     });
  //   }

  //   res.status(500).json({
  //     status: 'fail',
  //     message: 'Something went wrong!',
  //   });
  // }
  const { opportunityId, applicationId } = req.params;

  try {
    const application = await Applied.findOneAndUpdate(
      {
        opportunity: opportunityId,
        _id: applicationId,
        isShortListed: true,
        isHired: false,
      },
      {
        $set: {
          isHired: true,
        },
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application not found!',
      });
    }

    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityId, posted_by_email: req.user.email },
      {
        $pull: { shortListed: application?._id },
        $addToSet: { hired: application?._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: opportunity,
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

// reject an artist
exports.rejectAnArtist = async (req, res) => {
  // const { id, artistId } = req.params;

  // try {
  //   const application = await Applied.findOneAndUpdate(
  //     {
  //       artist: artistId,
  //       opportunity: id,
  //       isHired: false,
  //     },
  //     {
  //       $set: { isRejected: true },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   let opportunity;

  //   opportunity = await Opportunity.findOneAndUpdate(
  //     {
  //       id: application?.id,
  //       posted_by_email: req.user.email,
  //     },
  //     {
  //       $pull: { appliedBy: application?.id, shortListed: application?.id },
  //       $addToSet: { rejected: application?.id },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   if (!opportunity) {
  //     opportunity = await Opportunity.findOne({
  //       id: application?.id,
  //       posted_by_email: req.user.email,
  //     });
  //   }

  //   res.status(200).json({
  //     status: 'success',
  //     data: opportunity,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   if (error.name === 'CastError') {
  //     return res.status(500).json({
  //       status: 'fail',
  //       message: 'Invalid _id!',
  //     });
  //   }

  //   res.status(500).json({
  //     status: 'fail',
  //     message: 'Something went wrong!',
  //   });
  // }
  const { opportunityId, applicationId } = req.params;

  try {
    const application = await Applied.findOneAndUpdate(
      {
        opportunity: opportunityId,
        _id: applicationId,
        isHired: false,
      },
      {
        $set: {
          isRejected: true,
          isShortListed: false,
        },
      },
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application not found!',
      });
    }

    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityId, posted_by_email: req.user.email },
      {
        $pull: { shortListed: application?._id, appliedBy: application?._id },
        $addToSet: { rejected: application?._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: opportunity,
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
exports.findAnOpportunity = async (req, res) => {
  const docs = await Opportunity.find(req.query);

  return res.status(200).json({
    status: 'success',
    result: docs.length,
    data: {
      data: docs,
    },
  });
};

exports.getOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    const opportuity = await Opportunity.findOne({
      _id: id,
      posted_by_email: req.user.email,
    });

    if (!opportuity) {
      return res.status(404).json({
        status: 'fail',
        message: "Opportunity not found or may be it doesn't belongs to you!",
      });
    }

    res.status(200).json({
      status: 'success',
      data: opportuity,
    });
  } catch (error) {
    console.log(error);
    // res.status(500).json(error);
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

exports.deleteOpportunity = async (req, res) => {
  await Opportunity.findByIdAndDelete(req.profile._id);

  res.status(204).json({
    status: 'success',
    data: req.profile,
  });
};

exports.latestAppliedOpp = async (req, res) => {
  let opportunities = await Applied.find({ artist: req.user.id })
    .sort({
      createdAt: '-1',
    })
    .populate({ path: 'opportunity' });

  opportunities = opportunities.map((applied) => {
    return applied.opportunity;
  });

  res.status(200).json({
    status: 'success',
    results: opportunities.length,
    data: opportunities,
  });
};

exports.recentlyAppliedArtist = async (req, res) => {
  const { patronId } = req.query;

  if (!patronId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide patronId!',
    });
  }

  try {
    let appliedArtists = await Applied.find({
      'appliedOn.posted_by_email': patronId,
      isHired: false,
    })
      .sort({
        createdAt: '-1',
      })
      .limit(2)
      .populate({ path: 'artistId' });

    appliedArtists = appliedArtists.map(({ artistId }) => artistId);

    if (_.isEmpty(appliedArtists)) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: [null],
      });
    }

    res.status(200).json({
      status: 'success',
      results: appliedArtists.length,
      data: appliedArtists,
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

exports.recentlyHiredArtist = async (req, res) => {
  const { patronId } = req.query;

  if (!patronId) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please provide patronId!',
    });
  }

  try {
    let hiredArtists = await Hired.find(
      { hiredBy: patronId },
      { artistId: 1, _id: 0 }
    )
      .sort({
        createdAt: '-1',
      })
      .limit(2)
      .populate({ path: 'artistId' });

    hiredArtists = hiredArtists.map(({ artistId }) => artistId);

    if (_.isEmpty(hiredArtists)) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: [null],
      });
    }

    res.status(200).json({
      status: 'success',
      results: hiredArtists.length,
      data: hiredArtists,
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

exports.saveAnOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        status: 'fail',
        message: 'Opportunity not found!',
      });
    }

    const artist = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { savedOpportunities: opportunity.id },
      },
      {
        new: true,
      }
    ).populate({ path: 'savedOpportunities' });

    res.status(200).json({
      status: 'success',
      results: artist.savedOpportunities.length,
      data: artist.savedOpportunities.reverse(),
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

exports.removeSavedOpportunity = async (req, res) => {
  const { id } = req.params;

  try {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        status: 'fail',
        message: 'Opportunity not found!',
      });
    }

    const artist = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { savedOpportunities: opportunity.id },
      },
      {
        new: true,
      }
    )
      .populate({ path: 'savedOpportunities' })
      .sort({ savedOpportunities: -1 });

    res.status(200).json({
      status: 'success',
      results: artist.savedOpportunities.length,
      data: artist.savedOpportunities.reverse(),
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

exports.savedOpportunities = async (req, res) => {
  res.status(200).json({
    status: 'success',
    results: req.user.savedOpportunities.length,
    data: req.user.savedOpportunities,
  });
};

exports.search = async (req, res) => {
  const query = req.params.query;

  const opportunities = await Opportunity.find({
    $or: [
      { position: { $regex: query, $options: 'i' } },
      { about: { $regex: query, $options: 'i' } },
      { requirements: { $regex: query, $options: 'i' } },
      { type: { $regex: query, $options: 'i' } },
      { mode: { $regex: query, $options: 'i' } },
      { language: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
    ],
  }).sort({ createdAt: '-1' });

  res.status(200).json({
    status: 'success',
    result: opportunities.length,
    data: opportunities,
  });
};

exports.applications = async (req, res) => {
  try {
    const applications = await Applied.find(
      {
        isShortListed: false,
        isRejected: false,
      },
      { artist: 1 }
    )
      .populate({ path: 'artist opportunity' })
      .sort({ createdAt: -1 });

    let newApp = [];
    applications.forEach((app) => {
      if (app.opportunity.posted_by_email === req.user.email) {
        newApp.push(app);
      }
    });

    res.status(200).json({
      status: 'success',
      results: newApp.length,
      data: newApp,
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

exports.shortlistedApps = async (req, res) => {
  try {
    const applications = await Applied.find(
      {
        isHired: false,
        isRejected: false,
        isShortListed: true,
      },
      { artist: 1 }
    )
      .populate({ path: 'artist opportunity' })
      .sort({ createdAt: -1 });

    let newApp = [];
    applications.forEach((app) => {
      if (app.opportunity.posted_by_email === req.user.email) {
        newApp.push(app);
      }
    });

    res.status(200).json({
      status: 'success',
      results: newApp.length,
      data: newApp,
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
exports.hiredApps = async (req, res) => {
  try {
    const applications = await Applied.find(
      {
        isHired: true,
        isRejected: false,
        isShortListed: true,
      },
      { artist: 1 }
    )
      .populate({ path: 'artist opportunity' })
      .sort({ createdAt: -1 });

    let newApp = [];
    applications.forEach((app) => {
      if (app.opportunity.posted_by_email === req.user.email) {
        newApp.push(app);
      }
    });

    res.status(200).json({
      status: 'success',
      results: newApp.length,
      data: newApp,
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

exports.appliedArtists = async (req, res) => {
  const { id } = req.params;

  try {
    const appliedArtists = await Applied.find(
      {
        opportunity: id,
        isShortListed: false,
        isRejected: false,
      },
      { artist: 1, _id: 0 }
    )
      .populate({ path: 'artist' })
      .sort({ createdAt: -1 });

    appliedArtists.forEach((artist) => {
      artist.artist.patron = undefined;
      artist.artist.special_services = undefined;
    });

    res.status(200).json({
      status: 'success',
      results: appliedArtists.length,
      data: appliedArtists,
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

exports.shortListedArtists = async (req, res) => {
  const { id } = req.params;

  try {
    const shortListedArtist = await Applied.find(
      {
        opportunity: id,
        isShortListed: true,
        isHired: false,
      },
      { artist: 1, _id: 0 }
    )
      .populate({ path: 'artist' })
      .sort({ createdAt: -1 });

    shortListedArtist.forEach((artist) => {
      artist.artist.patron = undefined;
      artist.artist.special_services = undefined;
    });

    res.status(200).json({
      status: 'success',
      results: shortListedArtist.length,
      data: shortListedArtist,
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

exports.hiredArtists = async (req, res) => {
  const { id } = req.params;

  try {
    const shortListedArtist = await Applied.find(
      {
        opportunity: id,
        isHired: true,
      },
      { artist: 1, _id: 0 }
    )
      .populate({ path: 'artist' })
      .sort({ createdAt: -1 });

    shortListedArtist.forEach((artist) => {
      artist.artist.patron = undefined;
      artist.artist.special_services = undefined;
    });

    res.status(200).json({
      status: 'success',
      results: shortListedArtist.length,
      data: shortListedArtist,
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

exports.rejectedArtists = async (req, res) => {
  const { id } = req.params;

  try {
    const shortListedArtist = await Applied.find(
      {
        opportunity: id,
        isShortListed: true,
        isHired: false,
      },
      { artist: 1, _id: 0 }
    )
      .populate({ path: 'artist' })
      .sort({ createdAt: -1 });

    shortListedArtist.forEach((artist) => {
      artist.artist.patron = undefined;
      artist.artist.special_services = undefined;
    });

    res.status(200).json({
      status: 'success',
      results: shortListedArtist.length,
      data: shortListedArtist,
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

exports.appliedOppArtist = async (req, res) => {
  const applications = await Applied.find(
    { artist: req.user.id },
    { opportunity: 1 }
  ).populate({ path: 'opportunity' });

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: applications,
  });
};
