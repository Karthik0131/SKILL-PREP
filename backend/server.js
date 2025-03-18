import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Import database connection
import quizRoutes from "./routes/quizRoutes.js"; // Import quiz routes
import questionRoutes from "./routes/questionRoutes.js"; // Import question routes
import studentRoutes from "./routes/studentRoutes.js"; // Import student routes
import analysisRoutes from "./routes/analysisRoutes.js"; // Import analysis routes


dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: "*" })); // Enable CORS for frontend communication

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/quizzes", quizRoutes); // Quiz Routes
app.use("/api/questions", questionRoutes); // Question Routes
app.use("/api/students", studentRoutes); // Student Routes
app.use("/api/analysis", analysisRoutes); // Analysis Routes


// Basic API Route
app.get("/", (req, res) => {
  res.send("Quiz App Backend is Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
