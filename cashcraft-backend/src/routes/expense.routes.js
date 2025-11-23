const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createExpenseValidator,
  updateExpenseValidator,
  getExpensesValidator
} = require('../validators/expense.validator');


router.use(protect);


router.get('/stats/summary', getExpenseStats);


router
  .route('/')
  .get(getExpensesValidator, validate, getExpenses)
  .post(createExpenseValidator, validate, createExpense);

router
  .route('/:id')
  .get(getExpenseById)
  .put(updateExpenseValidator, validate, updateExpense)
  .delete(deleteExpense);

module.exports = router;
