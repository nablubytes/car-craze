const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚗 Car Craze API is running successfully"
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
});