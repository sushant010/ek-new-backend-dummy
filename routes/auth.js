const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const { signout, signup, signin, isSignedIn } = require('../controller/auth');

//routes
router.get('/signout', signout);

//post route for signup and check validation
router.post(
  '/signup',
  [
    check('name')
      .isLength({ min: 3 })
      .withMessage('Enter Proper Name With Length More Than 3'),

    check('email').isEmail().withMessage('Enter Proper Email'),

    check('password')
      .isLength({ min: 5 })
      .withMessage('Enter Password Length Greater Than 5'),
  ],
  signup
);

router.post(
  '/signin',
  [
    check('email').isEmail().withMessage('Enter Proper Email'),

    check('password')
      .isLength({ min: 5 })
      .withMessage('Enter Password Length Greater Than 5'),
  ],
  signin
);

// router.get('/test', isSignedIn, (req, res) => {
//   res.json(req.auth);
// });

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure',
  });
});

router.get('/google', passport.authenticate('google', ['profile', 'email']));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
