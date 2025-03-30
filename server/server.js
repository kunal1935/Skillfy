import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhook, { stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API workings"));
app.post('/clerk', express.json(), (req, res, next) => {
    try {
        console.log("Incoming Clerk webhook request:", req.body); // Log the request for debugging
        next();
    } catch (error) {
        console.error("Error in webhook middleware:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}, clerkWebhook);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)
// Port
const PORT = process.env.PORT || 5050;

// Connect to MongoDB and start the server
connectDB()
await connectCloudinary().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`); // Logging the server is running on port
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit the process if the database connection fails
    });