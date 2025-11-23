const { body } = require('express-validator');

const createGoalValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('targetAmount')
    .notEmpty()
    .withMessage('Target amount is required')
    .isFloat({ min: 0 })
    .withMessage('Target amount must be a positive number'),
  
  body('currentAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current amount must be a positive number'),
  
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  body('category')
    .optional()
    .isIn(['savings', 'investment', 'purchase', 'debt_payment', 'emergency_fund', 'other'])
    .withMessage('Invalid category'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority')
];

const updateGoalValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('targetAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Target amount must be a positive number'),
  
  body('currentAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current amount must be a positive number'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  
  body('status')
    .optional()
    .isIn(['active', 'completed', 'abandoned'])
    .withMessage('Invalid status'),
  
  body('category')
    .optional()
    .isIn(['savings', 'investment', 'purchase', 'debt_payment', 'emergency_fund', 'other'])
    .withMessage('Invalid category'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority')
];

const updateGoalProgressValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number')
];

module.exports = {
  createGoalValidator,
  updateGoalValidator,
  updateGoalProgressValidator
};
