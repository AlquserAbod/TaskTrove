const router = require("express").Router();
const forgetPasswordValidator = require('../validators/forgetPasswordValidator');
const resetPasswordValidator = require("../validators/resetPasswordValidator");
const controller = require('../controllers/passwordResetController'); 

// send password link
router.post("/", forgetPasswordValidator ,controller.forgetPasswordController);
router.post('/:id/:token',resetPasswordValidator,controller.PasswordResetController)
module.exports = router;
