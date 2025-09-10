import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, month:{type:String,required:true}, limit:{type:Number,required:true} },{timestamps:true});
schema.index({userId:1,month:1},{unique:true});
export const Budget = mongoose.model('Budget', schema);
