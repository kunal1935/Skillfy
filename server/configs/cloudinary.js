import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async () => {
    const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env;

    // Log environment variables for debugging (remove in production)
    console.log('Cloudinary Config:', {
        CLOUDINARY_NAME,
        CLOUDINARY_API_KEY: CLOUDINARY_API_KEY ? '***' : null, // Mask sensitive data
        CLOUDINARY_SECRET_KEY: CLOUDINARY_SECRET_KEY ? '***' : null, // Mask sensitive data
    });

    if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET_KEY) {
        throw new Error('Missing Cloudinary configuration in environment variables');
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_SECRET_KEY,
    });
};

export default connectCloudinary;