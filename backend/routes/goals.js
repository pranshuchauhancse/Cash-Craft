import express from 'express'; import { authGuard } from '../middleware/auth.js'; import { Goal } from '../models/Goal.js';
const router = express.Router();
router.get('/', authGuard, async (req,res)=>{ const list = await Goal.find({ userId:req.user.id }).sort({ createdAt:-1 }); res.json(list); });
router.post('/', authGuard, async (req,res)=>{ const { title, target, saved } = req.body; const item = await Goal.create({ userId:req.user.id, title, target, saved }); res.status(201).json(item); });
router.put('/:id', authGuard, async (req,res)=>{ const updated = await Goal.findOneAndUpdate({ _id:req.params.id, userId:req.user.id }, req.body, { new:true }); res.json(updated); });
router.delete('/:id', authGuard, async (req,res)=>{ await Goal.findOneAndDelete({ _id:req.params.id, userId:req.user.id }); res.json({ success:true }); });
export default router;
