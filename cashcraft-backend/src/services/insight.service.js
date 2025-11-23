const Expense = require('../models/Expense');
const mongoose = require('mongoose');


const getExpensesByCategory = async (userId, startDate, endDate) => {
  const ObjectId = mongoose.Types.ObjectId;
  
  const result = await Expense.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
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
    }
  ]);

  return result.map(item => ({
    category: item._id,
    amount: item.total,
    count: item.count
  }));
};


const getDailyExpenses = async (userId, startDate, endDate) => {
  const ObjectId = mongoose.Types.ObjectId;
  
  const result = await Expense.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return result.map(item => ({
    date: item._id,
    amount: item.total,
    count: item.count
  }));
};


const getMonthlyExpenses = async (userId, year) => {
  const ObjectId = mongoose.Types.ObjectId;
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const result = await Expense.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$date' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return result.map(item => ({
    month: item._id,
    amount: item.total,
    count: item.count
  }));
};


const getExpenseTrends = async (userId, currentMonth) => {
  const ObjectId = mongoose.Types.ObjectId;
  
  
  const current = new Date(currentMonth + '-01');
  const previous = new Date(current);
  previous.setMonth(previous.getMonth() - 1);

  const currentMonthStr = current.toISOString().slice(0, 7);
  const previousMonthStr = previous.toISOString().slice(0, 7);

  const currentMonthExpenses = await Expense.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        date: {
          $gte: new Date(currentMonthStr + '-01'),
          $lt: new Date(current.getFullYear(), current.getMonth() + 1, 1)
        }
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
        date: {
          $gte: new Date(previousMonthStr + '-01'),
          $lt: new Date(current.getFullYear(), current.getMonth(), 1)
        }
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

  const currentTotal = currentMonthExpenses[0]?.total || 0;
  const previousTotal = previousMonthExpenses[0]?.total || 0;

  const change = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal) * 100 
    : 0;

  return {
    currentMonth: {
      month: currentMonthStr,
      total: currentTotal,
      count: currentMonthExpenses[0]?.count || 0
    },
    previousMonth: {
      month: previousMonthStr,
      total: previousTotal,
      count: previousMonthExpenses[0]?.count || 0
    },
    change: Math.round(change * 100) / 100,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
  };
};


const getTopCategories = async (userId, startDate, endDate, limit = 5) => {
  const ObjectId = mongoose.Types.ObjectId;
  
  const result = await Expense.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { total: -1 }
    },
    {
      $limit: limit
    }
  ]);

  return result.map(item => ({
    category: item._id,
    total: item.total,
    count: item.count,
    average: Math.round(item.avgAmount * 100) / 100
  }));
};

module.exports = {
  getExpensesByCategory,
  getDailyExpenses,
  getMonthlyExpenses,
  getExpenseTrends,
  getTopCategories
};
