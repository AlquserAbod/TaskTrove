const express = require('express');
const router = express.Router();
const controller = require('../controllers/emailVerifyController'); 

// Send verify email route
router.post('/send', controller.sendVerificationEmail);

// Verify email link route 
router.get("/:id/:token/", controller.verifyEmailLink);

module.exports = router;
