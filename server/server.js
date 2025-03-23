import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/database.js';
import {clerkWebhooks} from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
//intialize express
const app = express();

// middleware
app.use(cors());
app.use(clerkMiddleware())

//Routes
app.get('/',(req, res) => res.send("API workings"));
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter);

//Port
const PORT = process.env.PORT || 5050
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);  //logging the server is running on port
    connectDB();
})