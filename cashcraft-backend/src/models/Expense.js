const mongoose = require('mongoose');
const { EXPENSE_CATEGORIES } = require('../config/constants');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: EXPENSE_CATEGORIES
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'upi', 'bank_transfer', 'other'],
      default: 'cash'
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);


expenseSchema.index({ user: 1, date: -1 });


expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
