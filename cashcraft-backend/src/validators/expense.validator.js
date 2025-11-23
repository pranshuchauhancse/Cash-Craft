const { body, query } = require('express-validator');
const { EXPENSE_CATEGORIES } = require('../config/constants');

const createExpenseValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(EXPENSE_CATEGORIES)
    .withMessage('Invalid category'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot be more than 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'upi', 'bank_transfer', 'other'])
    .withMessage('Invalid payment method'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateExpenseValidator = [
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  body('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES)
    .withMessage('Invalid category'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot be more than 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot be more than 500 characters'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'upi', 'bank_transfer', 'other'])
    .withMessage('Invalid payment method'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const getExpensesValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  query('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES)
    .withMessage('Invalid category'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator,
  getExpensesValidator
};
