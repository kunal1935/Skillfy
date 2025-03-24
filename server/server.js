import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/database.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhook from './controllers/webhooks.js';
import educatorRoutes from './routes/educatorRoutes.js';
//intialize express
const app = express();

// middleware
app.use(cors());
app.use(clerkMiddleware())

//Routes
app.get('/',(req, res) => res.send("API workings"));
app.post('/clerk', express.json(), (req, res, next) => {
    console.log("Incoming Clerk webhook request:", req.body); // Log the request for debugging
    next();
}, clerkWebhook);
app.use('/api/educator',express.json(),educatorRoutes);

//Port
const PORT = process.env.PORT || 5050
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);  //logging the server is running on port
    connectDB();
})