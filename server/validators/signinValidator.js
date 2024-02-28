const { body } = require('express-validator');

const signinValidator = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = signinValidator;