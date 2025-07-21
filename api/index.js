require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("../server/routes/authRoutes");
const groupRoutes = require("../server/routes/groupRoutes");
const expenseRoutes = require("../server/routes/expenseRoutes");
const noticeRoutes = require("../server/routes/noticeRoutes");
const reminderRoutes = require("../server/routes/reminderRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "../server/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/reminders", reminderRoutes);

// Health check route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB connection
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}
connectDB();

module.exports = app;
