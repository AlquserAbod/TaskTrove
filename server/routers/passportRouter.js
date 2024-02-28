const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', passport.authenticate('google', { scope: ['profile',"email"] }));

router.get(
  '/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = req.authInfo.token; 

    res.redirect(`${process.env.APP_URL}?token=${token}`);
  }
);

module.exports = router;
