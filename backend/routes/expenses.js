import express from 'express';
import { authGuard } from '../middleware/auth.js';
import { Expense } from '../models/Expense.js';

const router = express.Router();

// GET /expenses - Get all expenses for authenticated user
router.get('/', authGuard, async (req, res) => {
  try {
    const list = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /expenses - Create new expense
router.post('/', authGuard, async (req, res) => {
  try {
    const { amount, category, kind, note, date } = req.body;
    const item = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      kind,
      note,
      date
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /expenses/:id - Update existing expense
router.put('/:id', authGuard, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /expenses/:id - Delete expense
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;