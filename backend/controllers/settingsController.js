const User = require('../models/User');
const currencyUtil = require('../utils/currency');

// GET /api/settings
exports.getSettings = async (req, res) => {
  const user = req.user;
  res.json({
    preferredCurrency: user.preferredCurrency,
    monthlyBudget: user.monthlyBudget,
    baseCurrency: currencyUtil.BASE,
    rates: currencyUtil.getRates()
  });
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  const { preferredCurrency, monthlyBudget } = req.body;
  try {
    if (preferredCurrency) req.user.preferredCurrency = preferredCurrency.toUpperCase();
    if (monthlyBudget !== undefined) {
      // assume incoming monthlyBudget is in user's chosen currency; convert to base for storage
      const mb = Number(monthlyBudget);
      if (isNaN(mb)) return res.status(400).json({ message: 'monthlyBudget must be a number' });
      // convert to base using provided preferredCurrency (if any) or user's existing
      const currencyToUse = preferredCurrency ? preferredCurrency.toUpperCase() : req.user.preferredCurrency;
      const converted = currencyUtil.toBase(mb, currencyToUse);
      req.user.monthlyBudget = Number(converted);
    }
    await req.user.save();
    res.json({ message: 'Settings updated', user: { preferredCurrency: req.user.preferredCurrency, monthlyBudget: req.user.monthlyBudget } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
