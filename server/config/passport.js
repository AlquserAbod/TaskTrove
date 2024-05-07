const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/user');
const { hashPassword } = require('../utils/hash_password.js');
const { signJWTToken } = require('../utils/jwtToken');
const generateRandomPassword = require('../utils/generatePassword');
const { default: axios } = require('axios');
const { log } = require('winston');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 
      `${process.env.API_URL}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      console.log("profile :", profile);
          await axios.post(`${process.env.API_URL}/auth/google/store`, {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            imagePath: profile.photos[0].value
          })
          .then((res) => {
            cb(null, res.data.user,{token: res.data.token})
          } ).catch((err) =>cb(err, null));

        } catch (err) {
        console.log("error in pass conf :", err);
        cb(err, null);
      }
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, doc) => {
    done(null, doc);
  });;
});

module.exports = passport;

