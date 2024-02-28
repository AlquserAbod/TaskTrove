const { body } = require('express-validator');
const User = require('../Models/user');

const validateUpdate = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ username: value });
            const currentUser = req.user;

            if (existingUser && value != currentUser.username) {
                throw new Error('Username already exists');
            }
            return true;
        }),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ email: value });
            const currentUser = req.user;
            if (existingUser && value != currentUser.email) {
                throw new Error('Email already exists');
            }
            return true;
        }),
];


module.exports = validateUpdate