const {body, validationResult} = require('express-validator');

//implement middlware to validate data for registering a method
exports.validateUser = [
  body('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage("You must Supply A Password"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  },
];