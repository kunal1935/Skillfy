import express from "express";
import cors from "cors";
import "dotenv/config"; 
import connectDB from "./configs/database.js";
import { clerkWebhooks } from "./contollers/webhooks.js";
import Query from "./models/queryModel.js"; // Ensure the Query model is correctly implemented

// Initialize Express
const app = express();

// Middlewares
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post('/clerk', express.json(), clerkWebhooks);

//Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
