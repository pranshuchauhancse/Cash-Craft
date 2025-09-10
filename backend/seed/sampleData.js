/**
 * Run this manually (node seed/sampleData.js) after setting .env
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const bcrypt = require('bcryptjs');

const run = async () => {
  await connectDB();
  try {
    await User.deleteMany({});
    await Expense.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user = new User({
      name: 'Demo User',
      email: 'demo@cashcraft.com',
      passwordHash,
      preferredCurrency: 'INR',
      monthlyBudget: 1000 // stored in base currency though; this is just seed example
    });
    await user.save();

    const sampleExpenses = [
      { user: user._id, amountBase: 5, originalAmount: 400, originalCurrency: 'INR', category: 'Food', note: 'Lunch', date: new Date() },
      { user: user._id, amountBase: 2, originalAmount: 150, originalCurrency: 'INR', category: 'Transport', note: 'Taxi', date: new Date() }
    ];
    await Expense.insertMany(sampleExpenses);
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
