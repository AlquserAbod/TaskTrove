const { body } = require('express-validator');

const resetPasswordValidator = [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('passwordVerify').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];

module.exports = resetPasswordValidator;