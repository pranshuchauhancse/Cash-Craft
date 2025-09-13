import express from 'express';
import { authGuard } from '../middleware/auth.js';
import { Goal } from '../models/Goal.js';

const router = express.Router();

// Helper function to calculate goal progress
function calculateProgress(goal) {
  const saved = goal.saved || 0;
  const target = goal.target || 0;
  
  if (target === 0) return { percentage: 0, isCompleted: false };
  
  const percentage = Math.min((saved / target) * 100, 100);
  const isCompleted = saved >= target;
  
  return {
    percentage: Math.round(percentage * 100) / 100,
    isCompleted,
    remaining: Math.max(target - saved, 0)
  };
}

// Helper function to format goal response
function formatGoalResponse(goal) {
  const progress = calculateProgress(goal);
  
  return {
    id: goal._id,
    title: goal.title,
    target: goal.target,
    saved: goal.saved,
    progress,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt
  };
}

// GET /goals - Get all goals for authenticated user
router.get('/', authGuard, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    const goalsWithProgress = goals.map(formatGoalResponse);
    
    res.json({
      success: true,
      data: goalsWithProgress,
      summary: {
        total: goals.length,
        completed: goalsWithProgress.filter(g => g.progress.isCompleted).length,
        totalSaved: goals.reduce((sum, g) => sum + (g.saved || 0), 0),
        totalTarget: goals.reduce((sum, g) => sum + (g.target || 0), 0)
      }
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals'
    });
  }
});

// POST /goals - Create new goal
router.post('/', authGuard, async (req, res) => {
  try {
    const { title, target, saved = 0 } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Goal title is required'
      });
    }

    if (target === undefined || target === null) {
      return res.status(400).json({
        success: false,
        message: 'Target amount is required'
      });
    }

    // Validate numeric fields
    if (typeof target !== 'number' || target <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be a positive number'
      });
    }

    if (typeof saved !== 'number' || saved < 0) {
      return res.status(400).json({
        success: false,
        message: 'Saved amount must be a non-negative number'
      });
    }

    if (saved > target) {
      return res.status(400).json({
        success: false,
        message: 'Saved amount cannot be greater than target amount'
      });
    }

    // Create new goal
    const newGoal = await Goal.create({
      userId: req.user.id,
      title: title.trim(),
      target,
      saved
    });

    const goalResponse = formatGoalResponse(newGoal);

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goalResponse
    });

  } catch (error) {
    console.error('Create goal error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create goal'
    });
  }
});

// PUT /goals/:id - Update existing goal
router.put('/:id', authGuard, async (req, res) => {
  try {
    const { title, target, saved } = req.body;
    const goalId = req.params.id;

    // Validate ObjectId format
    if (!goalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal ID format'
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Goal title cannot be empty'
        });
      }
      updateData.title = title.trim();
    }

    if (target !== undefined) {
      if (typeof target !== 'number' || target <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Target amount must be a positive number'
        });
      }
      updateData.target = target;
    }

    if (saved !== undefined) {
      if (typeof saved !== 'number' || saved < 0) {
        return res.status(400).json({
          success: false,
          message: 'Saved amount must be a non-negative number'
        });
      }
      updateData.saved = saved;
    }

    // Get current goal to validate saved vs target
    const currentGoal = await Goal.findOne({
      _id: goalId,
      userId: req.user.id
    });

    if (!currentGoal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const finalTarget = updateData.target || currentGoal.target;
    const finalSaved = updateData.saved !== undefined ? updateData.saved : currentGoal.saved;

    if (finalSaved > finalTarget) {
      return res.status(400).json({
        success: false,
        message: 'Saved amount cannot be greater than target amount'
      });
    }

    // Update the goal
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      updateData,
      { new: true }
    );

    const goalResponse = formatGoalResponse(updatedGoal);

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goalResponse
    });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal'
    });
  }
});

// DELETE /goals/:id - Delete goal
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const goalId = req.params.id;

    // Validate ObjectId format
    if (!goalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal ID format'
      });
    }

    const deletedGoal = await Goal.findOneAndDelete({
      _id: goalId,
      userId: req.user.id
    });

    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully',
      data: {
        deletedGoal: formatGoalResponse(deletedGoal)
      }
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal'
    });
  }
});

// PATCH /goals/:id/add-savings - Add amount to goal savings
router.patch('/:id/add-savings', authGuard, async (req, res) => {
  try {
    const goalId = req.params.id;
    const { amount } = req.body;

    // Validate ObjectId format
    if (!goalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal ID format'
      });
    }

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    const goal = await Goal.findOne({
      _id: goalId,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const newSavedAmount = (goal.saved || 0) + amount;

    // Allow exceeding target but warn user
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: req.user.id },
      { saved: newSavedAmount },
      { new: true }
    );

    const goalResponse = formatGoalResponse(updatedGoal);

    res.json({
      success: true,
      message: `Successfully added ${amount} to your goal`,
      data: goalResponse,
      info: newSavedAmount > goal.target ? 'Congratulations! You have exceeded your goal target!' : null
    });

  } catch (error) {
    console.error('Add savings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add savings to goal'
    });
  }
});

export default router;