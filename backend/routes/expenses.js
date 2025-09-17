const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Example route
router.post('/add', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
