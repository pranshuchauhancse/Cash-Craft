const express = require('express');
const router = express.Router();
const {
  setBudget,
  getBudget,
  getAllBudgets,
  getBudgetProgress,
  deleteBudget
} = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  setBudgetValidator,
  getBudgetValidator
} = require('../validators/budget.validator');


router.use(protect);


router.get('/all', getAllBudgets);


router.get('/:month/progress', getBudgetProgress);


router
  .route('/')
  .post(setBudgetValidator, validate, setBudget)
  .get(getBudgetValidator, validate, getBudget);


router.delete('/:month', deleteBudget);

module.exports = router;
