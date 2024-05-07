const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController'); 
const upload = require('../middleware/avatarMiddleware');
const signinValidator = require('../validators/signinValidator');
const signupValidator = require('../validators/SignupValidator');
const updateAuthValidator = require('../validators/updateAuthValidator');
const auth = require('../middleware/auth');
const resetPasswordValidator = require('../validators/resetPasswordValidator');


// Register route
router.post('/', upload.single('avatar'), signupValidator, controller.registerUser);



// Login route
router.post('/login', signinValidator, controller.loginUser);


// delete account route 
router.delete('/',auth, controller.deleteAcoount)



// get user route 
router.get('/user',auth, controller.getUser);

// get user route 
router.post('/change-password',auth,resetPasswordValidator, controller.UpdatePassword);

// get user route 
router.put(
    '/update',
    upload.single('avatar'), // Make sure this middleware doesn't interfere with form fields
    auth,
    updateAuthValidator,
    controller.updateUser
);

module.exports = router;
