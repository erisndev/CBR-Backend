// middleware/validateRoomCapacity.js
const Room = require("../models/room.model.js");
const RoomType = require("../models/roomtype.model.js");

const validateRoomCapacity = async (req, res, next) => {
  try {
    const {
      roomCapacity,
      capacity: capacityAlias,
      roomTypeCapacity,
      roomId,
      room,
      roomTypeId,
    } = req.body;

    // Accept 'guest' (singular) as an alias and normalize to 'guests'
    const incomingGuests = req.body.guests !== undefined ? req.body.guests : req.body.guest;

    // 1) Normalize/compute total guest count from supported shapes
    let totalGuests;
    if (typeof incomingGuests === "number") {
      totalGuests = incomingGuests;
    } else if (incomingGuests && typeof incomingGuests === "object") {
      const adults = Number(incomingGuests.adults || 0);
      const children = Number(incomingGuests.children || 0);
      totalGuests = adults + children;
    }

    if (totalGuests == null || Number.isNaN(totalGuests)) {
      return res
        .status(400)
        .json({ message: "Guests must be a number or an object { adults, children }." });
    }

    // 2) Determine capacity from multiple possible sources
    let capacity = null;

    // a) Direct numeric fields supplied by client
    if (typeof roomCapacity === "number") capacity = roomCapacity;
    if (capacity == null && typeof capacityAlias === "number") capacity = capacityAlias; // allow 'capacity'
    if (capacity == null && typeof roomTypeCapacity === "number") capacity = roomTypeCapacity;

    // b) Infer from roomId -> RoomType.capacity
    if (capacity == null) {
      let roomIdToUse = roomId ?? room;
      if (roomIdToUse && typeof roomIdToUse === "object" && roomIdToUse._id) {
        roomIdToUse = roomIdToUse._id;
      }

      if (roomIdToUse) {
        // Try with populate first
        const populatedRoom = await Room.findById(roomIdToUse).populate("roomType");
        if (populatedRoom && populatedRoom.roomType && typeof populatedRoom.roomType.capacity === "number") {
          capacity = populatedRoom.roomType.capacity;
        } else if (populatedRoom && populatedRoom.roomType) {
          // If roomType is an ObjectId, fetch RoomType directly
          const rt = await RoomType.findById(populatedRoom.roomType);
          if (rt && typeof rt.capacity === "number") capacity = rt.capacity;
        }
      }
    }

    // c) Infer directly from roomTypeId if provided
    if (capacity == null && roomTypeId) {
      const rt = await RoomType.findById(roomTypeId);
      if (rt && typeof rt.capacity === "number") {
        capacity = rt.capacity;
      }
    }

    // If capacity couldn't be determined here, allow downstream service to resolve it or the service layer to assign a room.
    if (capacity == null) {
      // proceed; no capacity enforcement at middleware level
    } else {
      if (typeof capacity !== "number") {
        return res.status(400).json({ message: "Room capacity must be a number." });
      }
      if (totalGuests > capacity) {
        return res
          .status(400)
          .json({ message: "Number of guests exceeds room capacity." });
      }
    }

    // Ensure 'guests' is set from alias 'guest' if provided
    if (req.body.guests === undefined && req.body.guest !== undefined) {
      req.body.guests = req.body.guest;
      delete req.body.guest;
    }

    // 3) Normalize guests to a number for Booking schema compatibility
    if (typeof req.body.guests === "object") {
      const adults = Number(req.body.guests.adults || 0);
      const children = Number(req.body.guests.children || 0);
      req.body.guests = adults + children;
    } else if (typeof req.body.guests !== "number") {
      // default to 1 if not numeric
      const n = Number(req.body.guests);
      req.body.guests = Number.isNaN(n) || n < 1 ? 1 : n;
    }

    // Expose resolved capacity if downstream needs it
    req.body.roomCapacity = capacity;

    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.message || "Capacity validation failed." });
  }
};

module.exports = { validateRoomCapacity };
