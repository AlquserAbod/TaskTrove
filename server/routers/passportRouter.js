const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController'); 

router.get('/', passport.authenticate('google', { scope: ['profile',"email"] }));

router.get(
  '/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = req.authInfo.token; 

    res.redirect(`${process.env.APP_URL}?token=${token}`);
  }
);


router.post('/store', authController.storeGoogleUserInDB);

module.exports = router;
