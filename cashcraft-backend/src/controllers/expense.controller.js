const expenseService = require('../services/expense.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user._id, req.body);

    return successResponse(
      res,
      HTTP_STATUS.CREATED,
      'Expense created successfully',
      { expense }
    );
  } catch (error) {
    next(error);
  }
};


const getExpenses = async (req, res, next) => {
  try {
    const { startDate, endDate, category, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (category) filters.category = category;

    const result = await expenseService.getExpenses(
      req.user._id,
      filters,
      parseInt(page),
      parseInt(limit)
    );

    return paginatedResponse(
      res,
      HTTP_STATUS.OK,
      'Expenses retrieved successfully',
      result.expenses,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};


const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.user._id, req.params.id);

    if (!expense) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Expense not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Expense retrieved successfully', { expense });
  } catch (error) {
    next(error);
  }
};


const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(
      req.user._id,
      req.params.id,
      req.body
    );

    if (!expense) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Expense not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Expense updated successfully', { expense });
  } catch (error) {
    next(error);
  }
};


const deleteExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.deleteExpense(req.user._id, req.params.id);

    if (!expense) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Expense not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
};


const getExpenseStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Start date and end date are required'
      );
    }

    const total = await expenseService.calculateTotalExpenses(
      req.user._id,
      startDate,
      endDate
    );

    return successResponse(res, HTTP_STATUS.OK, 'Statistics retrieved successfully', {
      startDate,
      endDate,
      total
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats
};
