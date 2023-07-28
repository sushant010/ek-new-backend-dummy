const express = require('express');
const router = express.Router();

const queryController = require('../controller/queries');
const { protect, restrictTo } = require('../controller/auth');

//post a query
router.post('/', queryController.postQuery);

// fetch all query (admin protected routes)
router.get('/all', protect, restrictTo(0), queryController.queriesPosted);

module.exports = router;
