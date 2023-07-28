const express = require('express');
const router = express.Router();

const userController = require('../controller/user');
const { protect, restrictTo } = require('../controller/auth');

const fileUploadController = require('../controller/fileUploadController');
const commentController = require('../controller/comments');

//*******************USER***********************//

router.get('/', protect, restrictTo(1, 2, 3, 4), userController.getUser);

router.patch('/', protect, restrictTo(1, 2, 3, 4), userController.updateUser);

router.get('/top/artists', userController.topArtists);

//*******************USER***********************//

//forgot password
router.post('/forgotpassword', userController.forgotPassword);

//reset Password
router.post('/resetpassword', userController.resetPassword);

router.get('/artis/:id', protect, restrictTo(1), userController.getArtistById);

//image

router.post(
  '/avatar',
  protect,
  restrictTo(1, 2, 3, 4),
  fileUploadController.upload.single('image'),
  fileUploadController.uploadProfileImg
);
router
  .route('/avatar')
  .get(fileUploadController.getProfileImg)
  .delete(fileUploadController.delProfileImg);

// patron -> Artist

// to retrive all the comments for artist made by patron
router.get(
  '/comments/patron/:patronEmail',
  commentController.getAllPtronComments
);

// to post comment patron -> artist
router.post(
  '/comments/patron/comment/:patronEmail/:artistEmail',
  commentController.makeCommentToArtist
);

router.patch(
  '/comments/patron/comment/:patronEmail/:artistEmail/:commentId',
  commentController.updateCommentToArtist
);

router.delete(
  '/comments/patron/comment/:patronEmail/:artistEmail/:commentId',
  commentController.deleteCommentToArtist
);

// Artist -> patron

// retrive all comments of artist made for patron
router.get(
  '/comments/artist/:artistEmail',
  commentController.getAllArtistComments
);

// make a comment for patron by artist
router.post(
  '/comments/artist/comment/:artistEmail/:patronEmail',
  commentController.makeCommentToPatron
);

// update a comment for patron by artist
router.patch(
  '/comments/patron/comment/:artistEmail/:patronEmail/:commentId',
  commentController.updateCommentToPatron
);

// delete a comment for patron by artist
router.delete(
  '/comments/patron/comment/:artistEmail/:patronEmail/:commentId',
  commentController.deleteCommentToPatron
);

// patron -> artist
router.post(
  '/ratings/rate/artist',
  protect,
  restrictTo(1),
  userController.rateArtist
);

// artist -> patron
router.post(
  '/ratings/rate/patron',
  protect,
  restrictTo(2),
  userController.ratePatron
);

module.exports = router;
