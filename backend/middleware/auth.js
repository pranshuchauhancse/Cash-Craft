import jwt from 'jsonwebtoken';
export function authGuard(req,res,next){
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if(!token) return res.status(401).json({message:'Unauthorized'});
  try { const payload = jwt.verify(token, process.env.JWT_SECRET); req.user = payload; next(); }
  catch(e){ return res.status(401).json({message:'Invalid token'}) }
}
