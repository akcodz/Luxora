import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is required');
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error:any) {
        console.error('MongoDB connection error:', error.message);
    }
};

export default connectDB;