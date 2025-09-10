const { validationResult } = require("express-validator");
const Expense = require("../models/Expense");
const currencyUtil = require("../utils/currency");

// GET /api/expenses
exports.getExpenses = async (req, res) => {
  // optional filters: from, to, category, currency
  try {
    const userId = req.user._id;
    const { from, to, category, currency } = req.query;
    const query = { user: userId };
    if (category) query.category = category;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    const expenses = await Expense.find(query).sort({ date: -1 }).lean();
    // if currency requested, convert amounts from base
    const outCurrency = currency
      ? currency.toUpperCase()
      : req.user.preferredCurrency || currencyUtil.BASE;
    const converted = expenses.map((e) => {
      const amount = currencyUtil.fromBase(e.amountBase, outCurrency);
      return {
        ...e,
        displayAmount: Number(amount.toFixed(2)),
        displayCurrency: outCurrency,
      };
    });

    // compute aggregates
    const totalBase = expenses.reduce((s, e) => s + (e.amountBase || 0), 0);
    const totalDisplay = currencyUtil.fromBase(totalBase, outCurrency);

    res.json({
      expenses: converted,
      currency: outCurrency,
      totals: {
        totalBase,
        totalDisplay: Number(totalDisplay.toFixed(2)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/expenses
exports.createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user._id;
    const { originalAmount, originalCurrency, category, note, date } = req.body;
    const amountBase = currencyUtil.toBase(
      Number(originalAmount),
      originalCurrency.toUpperCase()
    );

    const expense = new Expense({
      user: userId,
      amountBase,
      originalAmount: Number(originalAmount),
      originalCurrency: originalCurrency.toUpperCase(),
      category: category || "Other",
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();
    res.json({ message: "Expense created", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (String(expense.user) !== String(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    const { originalAmount, originalCurrency, category, note, date } = req.body;
    if (originalAmount && originalCurrency) {
      expense.originalAmount = Number(originalAmount);
      expense.originalCurrency = originalCurrency.toUpperCase();
      expense.amountBase = currencyUtil.toBase(
        Number(originalAmount),
        originalCurrency.toUpperCase()
      );
    }
    if (category) expense.category = category;
    if (note) expense.note = note;
    if (date) expense.date = new Date(date);

    await expense.save();
    res.json({ message: "Expense updated", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (String(expense.user) !== String(req.user._id))
      return res.status(403).json({ message: "Forbidden" });
    await expense.remove();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
