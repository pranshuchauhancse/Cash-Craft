const express = require('express');
const router = express.Router();
const {
  getExpensesByCategory,
  getDailyExpenses,
  getMonthlyExpenses,
  getExpenseTrends,
  getTopCategories
} = require('../controllers/insight.controller');
const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.get('/category', getExpensesByCategory);
router.get('/daily', getDailyExpenses);
router.get('/monthly', getMonthlyExpenses);
router.get('/trends', getExpenseTrends);
router.get('/top-categories', getTopCategories);

module.exports = router;
