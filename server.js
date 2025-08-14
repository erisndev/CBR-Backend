// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL
  credentials: true, // if you want to send cookies/auth headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const roomRoutes = require("./routes/room.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const availabilityRoutes = require("./routes/availability.routes.js");

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/availability", availabilityRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Resort Booking API is running...");
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
