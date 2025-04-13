// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  googleAuthCallback,
  facebookAuthCallback,  // We'll create this below
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const passport = require('passport');

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Google OAuth endpoints
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

// Facebook OAuth endpoints
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  facebookAuthCallback
);

module.exports = router;
