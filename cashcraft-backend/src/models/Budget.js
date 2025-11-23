const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('../config/constants');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    month: {
      type: String,
      required: [true, 'Please provide a month (YYYY-MM format)'],
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format']
    },
    categoryBudgets: {
      type: Map,
      of: {
        allocated: {
          type: Number,
          min: [0, 'Budget amount cannot be negative'],
          default: 0
        },
        spent: {
          type: Number,
          default: 0,
          min: 0
        }
      }
    },
    totalAllocated: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);


budgetSchema.index({ user: 1, month: 1 }, { unique: true });


budgetSchema.methods.calculateTotals = function () {
  let allocated = 0;
  let spent = 0;

  if (this.categoryBudgets) {
    for (const [category, budget] of this.categoryBudgets) {
      allocated += budget.allocated || 0;
      spent += budget.spent || 0;
    }
  }

  this.totalAllocated = allocated;
  this.totalSpent = spent;
};


budgetSchema.pre('save', function (next) {
  this.calculateTotals();
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);
