import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  amount:{type:Number,required:true}, category:{type:String,required:true}, kind:{type:String,enum:['expense','income'],default:'expense'},
  note:{type:String}, date:{type:Date,default:Date.now}
},{timestamps:true});
export const Expense = mongoose.model('Expense', schema);
