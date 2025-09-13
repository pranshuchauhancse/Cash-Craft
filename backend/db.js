import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB:', conn.connection.host);
  } catch (e) {
    console.error('DB error', e.message);
    process.exit(1);
  }
}