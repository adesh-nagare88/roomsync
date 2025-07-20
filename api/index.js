const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Your Routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

// Example: Signup route
// app.post("/api/signup", async (req, res) => { ... });

// IMPORTANT: DO NOT CALL app.listen()
module.exports = app;
