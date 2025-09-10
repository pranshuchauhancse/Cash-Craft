import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const schema = new mongoose.Schema({ name:String, email:{type:String,unique:true,required:true}, password:{type:String,required:true}, preferredCurrency:{type:String,default:'INR'}, timezone:{type:String,default:'Asia/Kolkata'} }, { timestamps:true });
schema.pre('save', async function(next){ if(!this.isModified('password')) return next(); const s = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password,s); next(); });
schema.methods.verify = function(pwd){ return bcrypt.compare(pwd,this.password); };
export const User = mongoose.model('User', schema);
