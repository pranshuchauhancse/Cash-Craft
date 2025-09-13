const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name too short"),
  body("email")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6+ chars"),
  body("preferredCurrency")
    .optional()
    .isString(),
];

const loginValidator = [
  body("email")
    .isEmail(),
  body("password")
    .exists()
];

const expenseValidator = [
  body("originalAmount")
    .isNumeric(),
  body("originalCurrency")
    .isString(),
  body("category")
    .optional()
    .isString(),
  body("note")
    .optional()
    .isString(),
  body("date")
    .optional()
    .isISO8601(),
];

module.exports = {
  registerValidator,
  loginValidator,
  expenseValidator,
};