const express = require('express');
const router = express.Router();

const joinController = require('../controller/join');

const { protect, restrictTo } = require('../controller/auth');

// router.use(protect, restrictTo(0));

router.route('/').post(joinController.join).get(joinController.getAllJoins);

router.get('/:id', joinController.getJoinById);

module.exports = router;
