import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/database.js';
import {clerkWebhook} from './controllers/webhook.js';

//intialize express
const app = express();

// middleware
app.use(cors());

//Routes
app.get('/',(req, res) => res.send("API workings"));
app.post('/clerk', express.json(), clerkWebhook);

//Port
const PORT = process.env.PORT ||5050
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);  //logging the server is running on port
    connectDB();
})