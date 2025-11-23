const mongoose = require('mongoose');
const { GOAL_STATUS } = require('../config/constants');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [0, 'Target amount cannot be negative']
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative']
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    status: {
      type: String,
      enum: Object.values(GOAL_STATUS),
      default: GOAL_STATUS.ACTIVE
    },
    category: {
      type: String,
      enum: ['savings', 'investment', 'purchase', 'debt_payment', 'emergency_fund', 'other'],
      default: 'savings'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);


goalSchema.virtual('progress').get(function () {
  if (this.targetAmount === 0) return 0;
  return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
});


goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });


goalSchema.pre('save', function (next) {
  if (this.currentAmount >= this.targetAmount && this.status === GOAL_STATUS.ACTIVE) {
    this.status = GOAL_STATUS.COMPLETED;
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
