const express = require('express');
const router = express.Router();

const opportunityController = require('../controller/opportunity');

const { protect, restrictTo } = require('../controller/auth');

//create opportunity
router.post(
  '/',
  protect,
  restrictTo(1),
  opportunityController.createOpportunity
);

// Get all opportunities posted
router.get(
  '/all',
  protect,
  restrictTo(2),
  opportunityController.getAllOpportunities
);

// Get all opportunities posted by logged in patron
router.get(
  '/all/patron',
  protect,
  restrictTo(1),
  opportunityController.patronOpportunities
);

router
  .route('/:id')
  .get(protect, restrictTo(1), opportunityController.getOpportunity) // Get an opportunity of a logged in patron by id
  .patch(protect, restrictTo(1), opportunityController.updateOpportunity) // Update an opportunity of a logged in patron by id
  .delete(protect, restrictTo(1), opportunityController.deleteOpportunity); // Delete an opportunity of a logged in patron by id

//**************************************************//

//**************************************************//

router
  .route('/apply/:id')
  .post(protect, restrictTo(2), opportunityController.applyOpportunity) //apply for an opportunity ( logged in artist )
  .delete(protect, restrictTo(2), opportunityController.removeOpportunity); //withdraw/remove application for an opportunity ( logged in artist )

//**************************************************//

//**************************************************//

router.post(
  '/:opportunityId/shortlist/:applicationId',
  protect,
  restrictTo(1),
  opportunityController.shortListAnArtist
);

router.post(
  '/:opportunityId/hire/:applicationId',
  protect,
  restrictTo(1),
  opportunityController.hireAnArtist
);

router.post(
  '/:opportunityId/reject/:applicationId',
  protect,
  restrictTo(1),
  opportunityController.rejectAnArtist
);

//**************************************************//

//**************************************************//

router.get(
  '/:id/applied',
  protect,
  restrictTo(1),
  opportunityController.appliedArtists
);
router.get(
  '/all/applications',
  protect,
  restrictTo(1),
  opportunityController.applications
);

router.get(
  '/all/applications/shortlisted',
  protect,
  restrictTo(1),
  opportunityController.shortlistedApps
);

router.get(
  '/all/applications/hired',
  protect,
  restrictTo(1),
  opportunityController.hiredApps
);

router.get(
  '/:id/shortlisted',
  protect,
  restrictTo(1),
  opportunityController.shortListedArtists
);

router.get(
  '/:id/hired',
  protect,
  restrictTo(1),
  opportunityController.hiredArtists
);

router.get(
  '/:id/rejected',
  protect,
  restrictTo(1),
  opportunityController.rejectedArtists
);

//**************************************************//

router.get('/search/:query', opportunityController.search);

//**************************************************//

//**************************************************//

router
  .route('/save/:id')
  .post(protect, restrictTo(2), opportunityController.saveAnOpportunity)
  .delete(protect, restrictTo(2), opportunityController.removeSavedOpportunity);

router.get(
  '/save/all',
  protect,
  restrictTo(2),
  opportunityController.savedOpportunities
);

//**************************************************//

//**************************************************//

router.get(
  '/apply/latest',
  protect,
  restrictTo(2),
  opportunityController.latestAppliedOpp
);

//**************************************************//

//**************************************************//
// GET All Applied Opportunity (logged in artist)

router.get(
  '/applied/all',
  protect,
  restrictTo(2),
  opportunityController.appliedOppArtist
);

//**************************************************//

module.exports = router;
