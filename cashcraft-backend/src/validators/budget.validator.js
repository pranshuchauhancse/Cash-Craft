const { body, query } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../config/constants');

const setBudgetValidator = [
  body('month')
    .notEmpty()
    .withMessage('Month is required')
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage('Month must be in YYYY-MM format'),
  
  body('categoryBudgets')
    .notEmpty()
    .withMessage('Category budgets are required')
    .isObject()
    .withMessage('Category budgets must be an object')
    .custom((value) => {
      
      for (const category in value) {
        if (!EXPENSE_CATEGORIES.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }
        if (typeof value[category] !== 'number' || value[category] < 0) {
          throw new Error(`Budget for ${category} must be a positive number`);
        }
      }
      return true;
    })
];

const updateBudgetValidator = [
  body('categoryBudgets')
    .optional()
    .isObject()
    .withMessage('Category budgets must be an object')
    .custom((value) => {
      
      for (const category in value) {
        if (!EXPENSE_CATEGORIES.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }
        if (typeof value[category] !== 'number' || value[category] < 0) {
          throw new Error(`Budget for ${category} must be a positive number`);
        }
      }
      return true;
    })
];

const getBudgetValidator = [
  query('month')
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage('Month must be in YYYY-MM format')
];

module.exports = {
  setBudgetValidator,
  updateBudgetValidator,
  getBudgetValidator
};
