const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalsSummary
} = require('../controllers/goal.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createGoalValidator,
  updateGoalValidator,
  updateGoalProgressValidator
} = require('../validators/goal.validator');


router.use(protect);


router.get('/stats/summary', getGoalsSummary);


router
  .route('/')
  .get(getGoals)
  .post(createGoalValidator, validate, createGoal);

router
  .route('/:id')
  .get(getGoalById)
  .put(updateGoalValidator, validate, updateGoal)
  .delete(deleteGoal);


router.put(
  '/:id/progress',
  updateGoalProgressValidator,
  validate,
  updateGoalProgress
);

module.exports = router;
