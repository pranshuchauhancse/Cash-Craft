import express from 'express'; import jwt from 'jsonwebtoken'; import { User } from '../models/User.js';
const router = express.Router();
function tokenFor(u){ return jwt.sign({ id:u._id, email:u.email, name:u.name }, process.env.JWT_SECRET, { expiresIn:'7d' }); }

router.post('/register', async (req,res)=>{ try{ const {name,email,password} = req.body; if(!name||!email||!password) return res.status(400).json({message:'Missing fields'}); const exists = await User.findOne({email}); if(exists) return res.status(400).json({message:'Email exists'}); const u = await User.create({name,email,password}); return res.json({ token: tokenFor(u), user:{id:u._id,name:u.name,email:u.email}}); }catch(e){console.error(e);res.status(500).json({message:'Server'})}});

router.post('/login', async (req,res)=>{ try{ const {email,password} = req.body; if(!email||!password) return res.status(400).json({message:'Missing fields'}); const u = await User.findOne({email}); if(!u) return res.status(400).json({message:'Invalid credentials'}); const ok = await u.verify(password); if(!ok) return res.status(400).json({message:'Invalid credentials'}); return res.json({ token:tokenFor(u), user:{id:u._id,name:u.name,email:u.email} }); }catch(e){console.error(e);res.status(500).json({message:'Server'})}});

export default router;
