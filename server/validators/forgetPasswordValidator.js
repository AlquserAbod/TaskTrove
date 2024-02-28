const { body } = require('express-validator');
const signinValidator = [
    body('email').isEmail().withMessage('Invalid email format'),
];

module.exports = signinValidator;