const express = require('express');
const notificationController = require('../controller/notification');
const { protect, restrictTo } = require('../controller/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo(1, 2, 3, 4),
  notificationController.sendNotification
);

module.exports = router;
