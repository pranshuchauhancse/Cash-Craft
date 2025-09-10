import express from 'express'; import { authGuard } from '../middleware/auth.js'; import { User } from '../models/User.js';
const router = express.Router();
router.get('/', authGuard, async (req,res)=>{ const u = await User.findById(req.user.id).select('-password'); res.json(u); });
router.put('/', authGuard, async (req,res)=>{ const { name, preferredCurrency, timezone } = req.body; const updated = await User.findByIdAndUpdate(req.user.id, { name, preferredCurrency, timezone }, { new:true }).select('-password'); res.json(updated); });
export default router;
