const express = require('express');
const router = express.Router();

const userController = require('../controller/user');
const fileController = require('../controller/fileUploadController');

const { protect, restrictTo } = require('../controller/auth');

//*******************USER***********************//

// router.use(protect, restrictTo(0));

router.get('/user/:id', userController.getUser);

router.patch('/user/:id', userController.updateUser);

router.post('/users', userController.getAllUsers);

router.get('/opportunies', userController.getAllOpp);

router
  .route('/image')
  .post(
    fileController.uploadAdmin.single('image'),
    fileController.uploadImageAdmin
  )
  .get(fileController.getAdminUploadedImgs);

//*******************USER***********************//

module.exports = router;
