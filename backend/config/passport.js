// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in .env
      callbackURL: '/api/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: ' ', // Not used – you might generate a random string or hash a random value
          isAdmin: false,
          avatar: profile.photos[0].value,
        });
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,         // Set in .env
      clientSecret: process.env.FACEBOOK_APP_SECRET,   // Set in .env
      callbackURL: '/api/users/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Facebook may not always provide an email – ensure you handle that case
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@facebook.com`;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = await User.create({
          name: profile.displayName,
          email: email,
          password: ' ', // Not used
          isAdmin: false,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '/images/default-avatar.png',
        });
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
