import express from 'express'; import { authGuard } from '../middleware/auth.js'; import { Budget } from '../models/Budget.js'; import { Expense } from '../models/Expense.js';
const router = express.Router();

// returns an array of notification objects for frontend to display
router.get('/', authGuard, async (req,res)=>{
  // check current month budgets and expenses
  const now = new Date(); const month = now.toISOString().slice(0,7);
  const budget = await Budget.findOne({ userId:req.user.id, month });
  const start = new Date(`${month}-01T00:00:00.000Z`); const end = new Date(start); end.setMonth(end.getMonth()+1);
  const expenses = await Expense.find({ userId:req.user.id, date:{ $gte:start, $lt:end }, kind:'expense' });
  const spent = expenses.reduce((s,e)=> s + (e.amount||0), 0);
  const alerts = [];
  if(budget){
    const pct = spent / budget.limit;
    if(pct >= 1) alerts.push({ type:'budget_exceeded', message:`You exceeded your budget for ${month}` });
    else if(pct >= 0.9) alerts.push({ type:'budget_near', message:`You have used ${(pct*100).toFixed(0)}% of your budget for ${month}` });
  }
  res.json(alerts);
});

export default router;
