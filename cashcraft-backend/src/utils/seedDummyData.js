require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const { EXPENSE_CATEGORIES } = require('../config/constants');

const seedData = async () => {
  try {
    await connectDB();

    
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Expense.deleteMany();
    await Goal.deleteMany();
    await Budget.deleteMany();

    
    console.log('Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@cashcraft.com',
      passwordHash: 'password123',
      currency: 'INR'
    });

    console.log(`Demo user created with ID: ${demoUser._id}`);
    console.log('Email: demo@cashcraft.com');
    console.log('Password: password123');

    
    console.log('Generating expenses...');
    const expenses = [];
    const now = new Date();

    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const randomCategory = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
      const randomAmount = Math.floor(Math.random() * 200) + 10;

      expenses.push({
        user: demoUser._id,
        amount: randomAmount,
        category: randomCategory,
        date: date,
        description: `${randomCategory} expense`,
        paymentMethod: ['cash', 'credit_card', 'debit_card', 'upi'][Math.floor(Math.random() * 4)]
      });
    }

    await Expense.insertMany(expenses);
    console.log(`${expenses.length} expenses created`);

    
    console.log('Creating goals...');
    const goals = [
      {
        user: demoUser._id,
        title: 'Emergency Fund',
        description: 'Build an emergency fund for 6 months of expenses',
        targetAmount: 10000,
        currentAmount: 3500,
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 
        category: 'emergency_fund',
        priority: 'high',
        status: 'active'
      },
      {
        user: demoUser._id,
        title: 'New Laptop',
        description: 'Save for a new MacBook Pro',
        targetAmount: 2500,
        currentAmount: 1200,
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), 
        category: 'purchase',
        priority: 'medium',
        status: 'active'
      },
      {
        user: demoUser._id,
        title: 'Vacation to Europe',
        description: 'Summer vacation trip',
        targetAmount: 5000,
        currentAmount: 800,
        dueDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000), 
        category: 'savings',
        priority: 'low',
        status: 'active'
      }
    ];

    await Goal.insertMany(goals);
    console.log(`${goals.length} goals created`);

    
    console.log('Creating budget...');
    const currentMonth = now.toISOString().slice(0, 7);
    
    const categoryBudgetsMap = new Map([
      ['Food & Dining', { allocated: 500, spent: 0 }],
      ['Transportation', { allocated: 200, spent: 0 }],
      ['Shopping', { allocated: 300, spent: 0 }],
      ['Entertainment', { allocated: 150, spent: 0 }],
      ['Bills & Utilities', { allocated: 400, spent: 0 }],
      ['Groceries', { allocated: 350, spent: 0 }],
      ['Healthcare', { allocated: 100, spent: 0 }],
      ['Others', { allocated: 200, spent: 0 }]
    ]);

    const budget = await Budget.create({
      user: demoUser._id,
      month: currentMonth,
      categoryBudgets: categoryBudgetsMap
    });

    
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthExpenses = await Expense.find({
      user: demoUser._id,
      date: { $gte: firstDayOfMonth }
    });

    for (const expense of currentMonthExpenses) {
      if (budget.categoryBudgets.has(expense.category)) {
        const categoryBudget = budget.categoryBudgets.get(expense.category);
        categoryBudget.spent += expense.amount;
        budget.categoryBudgets.set(expense.category, categoryBudget);
      }
    }

    await budget.save();
    console.log('Budget created for current month');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: demo@cashcraft.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
