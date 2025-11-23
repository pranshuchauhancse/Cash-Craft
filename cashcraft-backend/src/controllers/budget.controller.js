const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');


const setBudget = async (req, res, next) => {
  try {
    const { month, categoryBudgets } = req.body;

    
    let budget = await Budget.findOne({ user: req.user._id, month });

    if (budget) {
      
      for (const [category, amount] of Object.entries(categoryBudgets)) {
        const existingBudget = budget.categoryBudgets.get(category) || { spent: 0 };
        budget.categoryBudgets.set(category, {
          allocated: amount,
          spent: existingBudget.spent || 0
        });
      }
      await budget.save();
    } else {
      
      const categoryBudgetsMap = new Map();
      for (const [category, amount] of Object.entries(categoryBudgets)) {
        categoryBudgetsMap.set(category, { allocated: amount, spent: 0 });
      }

      budget = await Budget.create({
        user: req.user._id,
        month,
        categoryBudgets: categoryBudgetsMap
      });

      
      await recalculateBudgetSpent(req.user._id, month);
      budget = await Budget.findOne({ user: req.user._id, month });
    }

    return successResponse(res, HTTP_STATUS.CREATED, 'Budget set successfully', { budget });
  } catch (error) {
    next(error);
  }
};


const getBudget = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return errorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Month is required');
    }

    const budget = await Budget.findOne({ user: req.user._id, month });

    if (!budget) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Budget not found for this month');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Budget retrieved successfully', { budget });
  } catch (error) {
    next(error);
  }
};


const getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ month: -1 });

    return successResponse(res, HTTP_STATUS.OK, 'Budgets retrieved successfully', { budgets });
  } catch (error) {
    next(error);
  }
};


const getBudgetProgress = async (req, res, next) => {
  try {
    const { month } = req.params;

    const budget = await Budget.findOne({ user: req.user._id, month });

    if (!budget) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Budget not found for this month');
    }

    const progress = [];

    for (const [category, budgetData] of budget.categoryBudgets) {
      const percentage = budgetData.allocated > 0
        ? Math.round((budgetData.spent / budgetData.allocated) * 100)
        : 0;

      progress.push({
        category,
        allocated: budgetData.allocated,
        spent: budgetData.spent,
        remaining: Math.max(0, budgetData.allocated - budgetData.spent),
        percentage,
        status:
          percentage >= 100
            ? 'exceeded'
            : percentage >= 80
            ? 'warning'
            : 'good'
      });
    }

    return successResponse(res, HTTP_STATUS.OK, 'Budget progress retrieved successfully', {
      month,
      totalAllocated: budget.totalAllocated,
      totalSpent: budget.totalSpent,
      progress
    });
  } catch (error) {
    next(error);
  }
};


const deleteBudget = async (req, res, next) => {
  try {
    const { month } = req.params;

    const budget = await Budget.findOneAndDelete({ user: req.user._id, month });

    if (!budget) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, 'Budget not found');
    }

    return successResponse(res, HTTP_STATUS.OK, 'Budget deleted successfully');
  } catch (error) {
    next(error);
  }
};


const recalculateBudgetSpent = async (userId, month) => {
  const budget = await Budget.findOne({ user: userId, month });

  if (!budget) return;

  
  for (const [category, budgetData] of budget.categoryBudgets) {
    budgetData.spent = 0;
  }

  
  const startDate = new Date(month + '-01');
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate }
  });

  for (const expense of expenses) {
    if (budget.categoryBudgets.has(expense.category)) {
      const categoryBudget = budget.categoryBudgets.get(expense.category);
      categoryBudget.spent += expense.amount;
      budget.categoryBudgets.set(expense.category, categoryBudget);
    } else {
      budget.categoryBudgets.set(expense.category, {
        allocated: 0,
        spent: expense.amount
      });
    }
  }

  await budget.save();
};

module.exports = {
  setBudget,
  getBudget,
  getAllBudgets,
  getBudgetProgress,
  deleteBudget
};
