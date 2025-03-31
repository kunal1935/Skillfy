import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            tls: true, // Ensure secure connection
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Ensure your IP is whitelisted in MongoDB Atlas');
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB;