const insightService = require('../services/insight.service');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const getExpensesByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Start date and end date are required'
      );
    }

    const data = await insightService.getExpensesByCategory(
      req.user._id,
      startDate,
      endDate
    );

    return successResponse(res, HTTP_STATUS.OK, 'Category data retrieved successfully', { data });
  } catch (error) {
    next(error);
  }
};


const getDailyExpenses = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Start date and end date are required'
      );
    }

    const data = await insightService.getDailyExpenses(req.user._id, startDate, endDate);

    return successResponse(res, HTTP_STATUS.OK, 'Daily data retrieved successfully', { data });
  } catch (error) {
    next(error);
  }
};


const getMonthlyExpenses = async (req, res, next) => {
  try {
    const { year } = req.query;

    if (!year) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Year is required');
    }

    const data = await insightService.getMonthlyExpenses(req.user._id, parseInt(year));

    return successResponse(res, HTTP_STATUS.OK, 'Monthly data retrieved successfully', { data });
  } catch (error) {
    next(error);
  }
};


const getExpenseTrends = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Month is required (YYYY-MM format)');
    }

    const data = await insightService.getExpenseTrends(req.user._id, month);

    return successResponse(res, HTTP_STATUS.OK, 'Trend data retrieved successfully', { data });
  } catch (error) {
    next(error);
  }
};


const getTopCategories = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 5 } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Start date and end date are required'
      );
    }

    const data = await insightService.getTopCategories(
      req.user._id,
      startDate,
      endDate,
      parseInt(limit)
    );

    return successResponse(
      res,
      HTTP_STATUS.OK,
      'Top categories retrieved successfully',
      { data }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpensesByCategory,
  getDailyExpenses,
  getMonthlyExpenses,
  getExpenseTrends,
  getTopCategories
};
