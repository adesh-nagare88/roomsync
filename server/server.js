require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,              
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/reminders", reminderRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
