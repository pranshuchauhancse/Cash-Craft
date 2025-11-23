const Expense = require('../models/Expense');
const Budget = require('../models/Budget');


const createExpense = async (userId, expenseData) => {
  const expense = await Expense.create({
    ...expenseData,
    user: userId
  });

  
  await updateBudgetSpent(userId, expense.date, expense.category, expense.amount);

  return expense;
};


const getExpenses = async (userId, filters = {}, page = 1, limit = 20) => {
  const query = { user: userId };

  
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  if (filters.category) {
    query.category = filters.category;
  }

  
  const skip = (page - 1) * limit;

  
  const expenses = await Expense.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Expense.countDocuments(query);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};


const getExpenseById = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  return expense;
};


const updateExpense = async (userId, expenseId, updateData) => {
  const oldExpense = await Expense.findOne({ _id: expenseId, user: userId });
  
  if (!oldExpense) {
    return null;
  }

  
  if (updateData.amount || updateData.category) {
    const oldAmount = oldExpense.amount;
    const oldCategory = oldExpense.category;
    const newAmount = updateData.amount || oldAmount;
    const newCategory = updateData.category || oldCategory;

    
    await updateBudgetSpent(userId, oldExpense.date, oldCategory, -oldAmount);

    
    await updateBudgetSpent(userId, oldExpense.date, newCategory, newAmount);
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  return expense;
};


const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  
  if (!expense) {
    return null;
  }

  
  await updateBudgetSpent(userId, expense.date, expense.category, -expense.amount);

  await Expense.deleteOne({ _id: expenseId, user: userId });
  
  return expense;
};


const calculateTotalExpenses = async (userId, startDate, endDate) => {
  const result = await Expense.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
};


const updateBudgetSpent = async (userId, date, category, amount) => {
  const month = new Date(date).toISOString().slice(0, 7); 

  const budget = await Budget.findOne({ user: userId, month });

  if (budget) {
    
    if (!budget.categoryBudgets.has(category)) {
      budget.categoryBudgets.set(category, { allocated: 0, spent: 0 });
    }

    const categoryBudget = budget.categoryBudgets.get(category);
    categoryBudget.spent = Math.max(0, (categoryBudget.spent || 0) + amount);
    
    budget.categoryBudgets.set(category, categoryBudget);
    
    await budget.save();
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  calculateTotalExpenses
};
