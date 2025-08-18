// utils/roomStatusScheduler.js
// Periodically sync Room.status based on bookings so that:
// - A room is marked "booked" if it has any non-cancelled booking whose checkOut is in the future.
// - A room is marked "available" otherwise (excluding rooms in maintenance which we don't modify here).

const Room = require("../models/room.model.js");
const Booking = require("../models/bookings.model.js");

async function updateRoomStatuses() {
  const now = new Date();

  // Only consider rooms that are not in maintenance; we won't override maintenance state here
  const rooms = await Room.find({/* no filter to allow flipping maintenance if needed in future */}, "_id status");

  for (const room of rooms) {
    // Any pending/paid booking with a checkout in the future keeps the room in "booked" state
    const hasFutureOrOngoing = await Booking.exists({
      room: room._id,
      status: { $in: ["pending", "paid"] },
      checkOut: { $gt: now },
    });

    const desiredStatus = hasFutureOrOngoing ? "booked" : "available";

    // Do not auto-clear maintenance to available; only flip available<->booked automatically
    if (room.status === "maintenance") continue;

    if (room.status !== desiredStatus) {
      await Room.findByIdAndUpdate(room._id, { status: desiredStatus });
    }
  }
}

function startRoomStatusScheduler({ intervalMs = 5 * 60 * 1000 } = {}) {
  // Initial sync on startup
  updateRoomStatuses().catch((err) => console.error("roomStatusScheduler initial sync error", err));

  // Periodic sync
  setInterval(() => {
    updateRoomStatuses().catch((err) => console.error("roomStatusScheduler interval error", err));
  }, intervalMs);
}

module.exports = { startRoomStatusScheduler, updateRoomStatuses };
