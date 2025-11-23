const mongoose = require('mongoose');

const uri = "mongodb+srv://cashcraft_db:Cashcraft4@cashcraft.c3z4ijs.mongodb.net/cashcraft?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;