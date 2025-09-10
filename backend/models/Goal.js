import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, title:{type:String,required:true}, target:{type:Number,required:true}, saved:{type:Number,default:0} },{timestamps:true});
export const Goal = mongoose.model('Goal', schema);
