const express = require('express');
const router = express.Router();

const communityController = require('../controller/community');

const { protect } = require('../controller/auth');

router.post('/', protect, communityController.createACommunity);

router.get('/all', protect, communityController.getAllCommunities);

router.post('/:id/join', protect, communityController.joinACommunity); // bug

router.get('/:id/joined/all', protect, communityController.getJoinedMembers);

router.post('/:id/leave', protect, communityController.leaveACommunity); // bug

router.get('/:id', protect, communityController.getCommunityById);

router.get('/search/:query', protect, communityController.search); /// bug

module.exports = router;
