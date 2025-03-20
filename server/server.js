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

// New route to fetch queries
app.get('/queries', async (req, res) => {
  try {
    const queries = await Query.find(); // Fetch all queries from the database
    res.json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
