const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^[A-Za-z0-9 ]+$/)
    .withMessage("No special character allowed in Username"),
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

const passwordValidator = [
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password do not match");
      }
      return true;
    }),
];

const profileValidation = [
  body("username")
    .trim()
    .optional()
    .notEmpty()
    .withMessage("Username cannot be empty"),
  body("email").trim().optional().isEmail().withMessage("Valid email required"),
];

const deleteUserValidation = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Atleast one user id is required"),
  body("ids.*").isMongoId().withMessage("Each id must be a valid MongoDB ObjectId"),
];

const runValidation = (req, res, next) => {
  const errors = validationResult(req).formatWith(({ msg, path }) => {
    return `${path}: ${msg}`;
  });

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.mapped() });

  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  passwordValidator,
  profileValidation,
  deleteUserValidation,
  runValidation,
};
