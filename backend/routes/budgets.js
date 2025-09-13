import express from 'express';
import { authGuard } from '../middleware/auth.js';
import { Budget } from '../models/Budget.js';
import { Expense } from '../models/Expense.js';

const router = express.Router();

// GET /budgets - Get all budgets for authenticated user
router.get('/', authGuard, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id })
      .sort({ month: -1 });
    
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budgets'
    });
  }
});

// POST /budgets - Create or update budget for a month
router.post('/', authGuard, async (req, res) => {
  try {
    const { month, limit } = req.body;

    // Validate required fields
    if (!month || limit === undefined || limit === null) {
      return res.status(400).json({
        success: false,
        message: 'Month and limit are required'
      });
    }

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    // Validate limit is a positive number
    if (typeof limit !== 'number' || limit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a non-negative number'
      });
    }

    // Create or update budget
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month },
      {
        userId: req.user.id,
        month,
        limit
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(201).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget
    });

  } catch (error) {
    console.error('Create/update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save budget'
    });
  }
});

// GET /budgets/:month/summary - Get budget summary for a specific month
router.get('/:month/summary', authGuard, async (req, res) => {
  try {
    const { month } = req.params;

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    // Calculate date range for the month
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get all expenses for the month
    const expenses = await Expense.find({
      userId: req.user.id,
      date: {
        $gte: startDate,
        $lt: endDate
      },
      kind: 'expense'
    });

    // Calculate total spent
    const totalSpent = expenses.reduce((sum, expense) => {
      return sum + (expense.amount || 0);
    }, 0);

    // Get budget for the month
    const budget = await Budget.findOne({
      userId: req.user.id,
      month
    });

    const budgetLimit = budget?.limit || 0;
    const remaining = Math.max(budgetLimit - totalSpent, 0);
    const isOverBudget = budgetLimit > 0 && totalSpent > budgetLimit;
    const isNearingLimit = budgetLimit > 0 && totalSpent / budgetLimit >= 0.8;
    const percentageUsed = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

    // Group expenses by category for additional insights
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount || 0;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        month,
        budget: {
          limit: budgetLimit,
          exists: !!budget
        },
        spending: {
          total: totalSpent,
          remaining,
          overBudget: isOverBudget,
          nearingLimit: isNearingLimit,
          percentageUsed: Math.round(percentageUsed * 100) / 100,
          transactionCount: expenses.length
        },
        categoryBreakdown: expensesByCategory,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget summary'
    });
  }
});

// DELETE /budgets/:month - Delete budget for a specific month
router.delete('/:month', authGuard, async (req, res) => {
  try {
    const { month } = req.params;

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format'
      });
    }

    const deletedBudget = await Budget.findOneAndDelete({
      userId: req.user.id,
      month
    });

    if (!deletedBudget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found for the specified month'
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete budget'
    });
  }
});

export default router;