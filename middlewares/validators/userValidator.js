const { body, validationResult } = require("express-validator");

//implement middlware to validate data for registering a method
exports.validateUser = [
  body("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .bail(),
  body("password").trim().notEmpty().withMessage("You must Supply A Password"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errorMessage", "Something is wrong");
    } else {
      req.flash("successMessage", "You are successfully using req-flash");
    }
    next();
  },
];
