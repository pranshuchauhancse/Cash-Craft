const goalService = require('../services/goal.service');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const createGoal = async (req, res, next) => {
  try {
    const goal = await goalService.createGoal(req.user._id, req.body);

    return successResponse(res, HTTP_STATUS.CREATED, 'Goal created successfully', { goal });
  } catch (error) {
    next(error);
  }
};


const getGoals = async (req, res, next) => {
  try {
    const { status, category } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    const goals = await goalService.getGoals(req.user._id, filters);

    return successResponse(res, HTTP_STATUS.OK, 'Goals retrieved successfully', { goals });
  } catch (error) {
    next(error);
  }
};


const getGoalById = async (req, res, next) => {
  try {
    const goal = await goalService.getGoalById(req.user._id, req.params.id);

    if (!goal) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Goal not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Goal retrieved successfully', { goal });
  } catch (error) {
    next(error);
  }
};


const updateGoal = async (req, res, next) => {
  try {
    const goal = await goalService.updateGoal(req.user._id, req.params.id, req.body);

    if (!goal) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Goal not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Goal updated successfully', { goal });
  } catch (error) {
    next(error);
  }
};


const updateGoalProgress = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Amount is required');
    }

    const goal = await goalService.updateGoalProgress(
      req.user._id,
      req.params.id,
      parseFloat(amount)
    );

    if (!goal) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Goal not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Goal progress updated successfully', { goal });
  } catch (error) {
    next(error);
  }
};


const deleteGoal = async (req, res, next) => {
  try {
    const goal = await goalService.deleteGoal(req.user._id, req.params.id);

    if (!goal) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Goal not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Goal deleted successfully');
  } catch (error) {
    next(error);
  }
};


const getGoalsSummary = async (req, res, next) => {
  try {
    const summary = await goalService.getGoalsSummary(req.user._id);

    return successResponse(res, HTTP_STATUS.OK, 'Summary retrieved successfully', { summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalsSummary
};
