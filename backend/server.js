const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cors = require("cors");
const familyRoutes = require("./src/routes/family");
const photoRoutes = require("./src/routes/photos");
require("./src/utils/debug");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://omile-genealogy.vercel.app", // Production origin
        "http://localhost:3000", // Development origin
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, headers, others)
  })
);

// Routes
app.use("/api/family", familyRoutes);
app.use("/api/photos", photoRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
