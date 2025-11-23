const Goal = require('../models/Goal');


const createGoal = async (userId, goalData) => {
  const goal = await Goal.create({
    ...goalData,
    user: userId
  });

  return goal;
};


const getGoals = async (userId, filters = {}) => {
  const query = { user: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  const goals = await Goal.find(query).sort({ dueDate: 1 });

  return goals;
};


const getGoalById = async (userId, goalId) => {
  const goal = await Goal.findOne({ _id: goalId, user: userId });
  return goal;
};


const updateGoal = async (userId, goalId, updateData) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );

  return goal;
};


const updateGoalProgress = async (userId, goalId, amount) => {
  const goal = await Goal.findOne({ _id: goalId, user: userId });

  if (!goal) {
    return null;
  }

  goal.currentAmount = Math.max(0, goal.currentAmount + amount);

  await goal.save();

  return goal;
};


const deleteGoal = async (userId, goalId) => {
  const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });
  return goal;
};


const getGoalsSummary = async (userId) => {
  const goals = await Goal.find({ user: userId });

  const summary = {
    total: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    totalTarget: goals.reduce((sum, g) => sum + g.targetAmount, 0),
    totalSaved: goals.reduce((sum, g) => sum + g.currentAmount, 0)
  };

  return summary;
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
