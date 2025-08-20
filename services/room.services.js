// services/room.services.js
const RoomType = require("../models/roomtype.model.js");
const Room = require("../models/room.model.js");
const Booking = require("../models/bookings.model.js");

// ------------------------------
// Create individual room units
// ------------------------------
const createRoomUnits = async (roomTypeId, totalUnits) => {
  console.log("Service:createRoomUnits called", { roomTypeId, totalUnits });
  try {
    const units = [];

    const rt = await RoomType.findById(roomTypeId);
    if (!rt) throw new Error("Room type not found");

    const existingCount = await Room.countDocuments({ roomType: roomTypeId });

    for (let i = 0; i < totalUnits; i++) {
      const index = existingCount + i + 1;
      const codeBase = (rt.name || "ROOM").replace(/\s+/g, "-").toUpperCase();
      const unitCode = `${codeBase}-${index}`;

      const room = new Room({
        roomType: roomTypeId,
        unitCode,
        status: "available",
      });
      await room.save();
      units.push(room);
    }

    console.log("Service:createRoomUnits success", { created: units.length });
    return units;
  } catch (error) {
    console.error("Service:createRoomUnits error", error);
    throw error;
  }
};

// ------------------------------
// Create a new room type
// ------------------------------
const createRoomType = async (data) => {
  console.log("Service:createRoomType called", { data });
  try {
    const { totalUnits, ...roomTypeData } = data; // extract totalUnits
    const roomType = new RoomType(roomTypeData);
    const savedRoomType = await roomType.save();
    console.log("Service:createRoomType success", { id: savedRoomType._id });

    // Automatically create room units if totalUnits is provided
    if (totalUnits && totalUnits > 0) {
      await createRoomUnits(savedRoomType._id, totalUnits);
      console.log(`Service:createRoomType created ${totalUnits} room units`);
    }

    return savedRoomType;
  } catch (error) {
    console.error("Service:createRoomType error", error);
    throw error;
  }
};

// ------------------------------
// Update room type
// ------------------------------
const updateRoomType = async (id, data) => {
  console.log("Service:updateRoomType called", { id, data });
  try {
    const updated = await RoomType.findByIdAndUpdate(id, data, { new: true });
    console.log("Service:updateRoomType success", {
      id: updated ? updated._id : null,
    });
    return updated;
  } catch (error) {
    console.error("Service:updateRoomType error", error);
    throw error;
  }
};

// ------------------------------
// Delete room type and its rooms
// ------------------------------
const deleteRoomType = async (id) => {
  console.log("Service:deleteRoomType called", { id });
  try {
    const roomType = await RoomType.findById(id);
    if (!roomType) {
      console.log("Service:deleteRoomType not found", { id });
      return null;
    }

    // Delete all rooms for this room type
    await Room.deleteMany({ roomType: id });

    // Delete the room type itself
    await RoomType.deleteOne({ _id: id });

    console.log("Service:deleteRoomType success", { id });
    return true;
  } catch (error) {
    console.error("Service:deleteRoomType error", error);
    throw error;
  }
};

// ------------------------------
// Get all room types
// ------------------------------
const getRoomTypesWithAvailability = async () => {
  console.log("Service:getRoomTypesWithAvailability called");
  try {
    const roomTypes = await RoomType.find();
    console.log("Service:getRoomTypesWithAvailability success", {
      count: roomTypes.length,
    });
    return roomTypes;
  } catch (error) {
    console.error("Service:getRoomTypesWithAvailability error", error);
    throw error;
  }
};

// ------------------------------
// Get available rooms by dates
// ------------------------------
const getAvailableRooms = async (roomTypeId, checkIn, checkOut, guests) => {
  console.log("Service:getAvailableRooms called", {
    roomTypeId,
    checkIn,
    checkOut,
    guests,
  });
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestCount = parseInt(guests);

    const filter = { capacity: { $gte: guestCount } };
    if (roomTypeId) filter._id = roomTypeId;

    const roomTypes = await RoomType.find(filter);
    console.log("Service:getAvailableRooms roomTypes found", {
      count: roomTypes.length,
    });

    const availableRooms = [];

    for (const roomType of roomTypes) {
      const rooms = await Room.find({
        roomType: roomType._id,
        status: { $ne: "maintenance" },
      });

      console.log("Service:getAvailableRooms rooms for type", {
        roomTypeId: roomType._id,
        rooms: rooms.length,
      });

      for (const room of rooms) {
        const conflict = await Booking.findOne({
          room: room._id,
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
          status: { $ne: "cancelled" },
        });

        if (!conflict) {
          availableRooms.push({
            _id: room._id,
            roomTypeId: roomType._id,
            name: roomType.name,
            capacity: roomType.capacity,
            price: roomType.pricePerNight,
            description: roomType.description,
            unitCode: room.unitCode,
          });
        } else {
          console.log("Service:getAvailableRooms conflict for room", {
            roomId: room._id,
          });
        }
      }
    }

    console.log("Service:getAvailableRooms result", {
      available: availableRooms.length,
    });
    return availableRooms;
  } catch (error) {
    console.error("Service:getAvailableRooms error", error);
    throw error;
  }
};

// ------------------------------
// Export all services
// ------------------------------
module.exports = {
  createRoomUnits,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypesWithAvailability,
  getAvailableRooms,
};
