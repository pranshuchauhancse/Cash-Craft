import express from 'express'; import { authGuard } from '../middleware/auth.js'; import { Expense } from '../models/Expense.js';
const router = express.Router();

router.get('/', authGuard, async (req,res)=>{ const list = await Expense.find({ userId: req.user.id }).sort({ date:-1 }); res.json(list); });
router.post('/', authGuard, async (req,res)=>{ const { amount, category, kind, note, date } = req.body; const item = await Expense.create({ userId:req.user.id, amount, category, kind, note, date }); res.status(201).json(item); });
router.put('/:id', authGuard, async (req,res)=>{ const updated = await Expense.findOneAndUpdate({ _id:req.params.id, userId:req.user.id }, req.body, { new:true }); res.json(updated); });
router.delete('/:id', authGuard, async (req,res)=>{ await Expense.findOneAndDelete({ _id:req.params.id, userId:req.user.id }); res.json({ success:true }); });

export default router;
