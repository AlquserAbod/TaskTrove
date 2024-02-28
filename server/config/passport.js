const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/user');
const { hashPassword } = require('../utils/hash_password.js');
const { signJWTToken } = require('../utils/jwtToken');
const generateRandomPassword = require('../utils/generatePassword');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'api/auth/google/callback' // Your callback URL
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
          if(!user){
            user = await new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              password: await hashPassword(generateRandomPassword()),
              imagePath: profile.photos[0].value,
              isVerified: true,
            }).save();
          }

          const token = signJWTToken(user._id);

          cb(null, user,{token});
      } catch (err) {
        console.log(err);
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

