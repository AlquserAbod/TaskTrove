const { body, validationResult } = require('express-validator');
const { Colors } = require('../Models/task'); 

const validateTask = [
  // Validate request body fields
  body('title').isString().notEmpty(),
  body('color').custom(value => {
    if (!Object.values(Colors).includes(value)) {
      throw new Error('Invalid color');
    }
    return true;
  }), // Assuming predefined colors
  
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateTask;
