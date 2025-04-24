import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Timeout for server selection
            socketTimeoutMS: 45000, // Timeout for operations
            connectTimeoutMS: 30000, // Timeout for initial connection
        });
        console.log(`MongoDB connected to ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;