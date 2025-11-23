const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const { successResponse } = require('../utils/formatResponse');
const { HTTP_STATUS } = require('../config/constants');
const mongoose = require('mongoose');


const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ObjectId = mongoose.Types.ObjectId;

    
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    
    const previousMonth = new Date(now);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthStr = previousMonth.toISOString().slice(0, 7);
    const firstDayOfPrevMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
    const lastDayOfPrevMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);

    
    const currentMonthExpenses = await Expense.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    
    const previousMonthExpenses = await Expense.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          date: { $gte: firstDayOfPrevMonth, $lte: lastDayOfPrevMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const currentTotal = currentMonthExpenses[0]?.total || 0;
    const previousTotal = previousMonthExpenses[0]?.total || 0;
    const expenseChange = previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

    
    const recentExpenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    
    const goals = await Goal.find({ user: userId, status: 'active' })
      .sort({ dueDate: 1 })
      .limit(3);

    
    const budget = await Budget.findOne({ user: userId, month: currentMonth });

    
    const topCategories = await Expense.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
          date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 5
      }
    ]);

    
    let savings = null;
    if (budget) {
      const totalBudget = budget.totalAllocated;
      const totalSpent = budget.totalSpent;
      savings = {
        budgeted: totalBudget,
        spent: totalSpent,
        remaining: Math.max(0, totalBudget - totalSpent),
        percentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
      };
    }

    
    const dashboardData = {
      currentMonth: {
        month: currentMonth,
        totalExpenses: currentTotal,
        expenseCount: currentMonthExpenses[0]?.count || 0,
        changeFromLastMonth: Math.round(expenseChange * 100) / 100
      },
      recentExpenses,
      activeGoals: goals.map(goal => ({
        ...goal.toJSON(),
        progress: goal.progress
      })),
      budget: savings,
      topCategories: topCategories.map(cat => ({
        category: cat._id,
        total: cat.total,
        count: cat.count
      }))
    };

    return successResponse(
      res,
      HTTP_STATUS.OK,
      'Dashboard data retrieved successfully',
      dashboardData
    );
  } catch (error) {
    next(error);
  }
};


const getQuickStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    
    const totalExpensesResult = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    
    const totalGoals = await Goal.countDocuments({ user: userId });
    const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });

    
    const activeBudgets = await Budget.countDocuments({ user: userId });

    const stats = {
      totalExpenses: totalExpensesResult[0]?.total || 0,
      totalTransactions: await Expense.countDocuments({ user: userId }),
      totalGoals,
      completedGoals,
      activeBudgets
    };

    return successResponse(res, HTTP_STATUS.OK, 'Quick stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  getQuickStats
};
