// resetBookings.js
const mongoose = require("mongoose");
const Booking = require("./models/bookings.model.js");
const Room = require("./models/room.model.js");

// Replace with your MongoDB connection string
const MONGO_URI =
  "mongodb+srv://ferdinand:b0t5xsEC0XfCzeom@cluster0.m2rvlrh.mongodb.net/CBR-DB?retryWrites=true&w=majority&appName=Cluster0";

const resetBookings = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find all rooms that have bookings
    const bookedRooms = await Booking.find().distinct("room");

    // Delete all bookings
    const deleteResult = await Booking.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} bookings`);

    // Set all booked rooms to available
    const updateResult = await Room.updateMany(
      { _id: { $in: bookedRooms } },
      { $set: { status: "available" } }
    );
    console.log(`Updated ${updateResult.modifiedCount} rooms to available`);

    console.log("Reset completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting bookings:", error);
    process.exit(1);
  }
};

resetBookings();
