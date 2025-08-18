// services/room.services.js
const RoomType = require("../models/roomtype.model.js");
const Room = require("../models/room.model.js");
const Booking = require("../models/bookings.model.js"); // make sure this exists

// Create a new room type
exports.createRoomType = async (data) => {
  console.log('Service:createRoomType called', { data });
  try {
    const roomType = new RoomType(data);
    const saved = await roomType.save();
    console.log('Service:createRoomType success', { id: saved._id });
    return saved;
  } catch (error) {
    console.error('Service:createRoomType error', error);
    throw error;
  }
};

// Update room type
exports.updateRoomType = async (id, data) => {
  console.log('Service:updateRoomType called', { id, data });
  try {
    const updated = await RoomType.findByIdAndUpdate(id, data, { new: true });
    console.log('Service:updateRoomType success', { id: updated ? updated._id : null });
    return updated;
  } catch (error) {
    console.error('Service:updateRoomType error', error);
    throw error;
  }
};

// Delete room type and its rooms
exports.deleteRoomType = async (id) => {
  console.log('Service:deleteRoomType called', { id });
  try {
    const roomType = await RoomType.findById(id);
    if (!roomType) {
      console.log('Service:deleteRoomType not found', { id });
      return null;
    }

    await Room.deleteMany({ roomType: id });
    await roomType.remove();
    console.log('Service:deleteRoomType success', { id });
    return true;
  } catch (error) {
    console.error('Service:deleteRoomType error', error);
    throw error;
  }
};

// Create individual room units
exports.createRoomUnits = async (roomTypeId, totalUnits) => {
  console.log('Service:createRoomUnits called', { roomTypeId, totalUnits });
  try {
    const units = [];

    // Ensure room type exists for unitCode generation
    const rt = await RoomType.findById(roomTypeId);
    if (!rt) {
      console.log('Service:createRoomUnits room type not found', { roomTypeId });
      throw new Error("Room type not found");
    }

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
    console.log('Service:createRoomUnits success', { created: units.length });
    return units;
  } catch (error) {
    console.error('Service:createRoomUnits error', error);
    throw error;
  }
};

// Get room types with availability info
exports.getRoomTypesWithAvailability = async () => {
  console.log('Service:getRoomTypesWithAvailability called');
  try {
    const roomTypes = await RoomType.find();
    console.log('Service:getRoomTypesWithAvailability success', { count: roomTypes.length });
    return roomTypes;
  } catch (error) {
    console.error('Service:getRoomTypesWithAvailability error', error);
    throw error;
  }
};

// Get available rooms for given dates and guests
exports.getAvailableRooms = async (roomTypeId, checkIn, checkOut, guests) => {
  console.log('Service:getAvailableRooms called', { roomTypeId, checkIn, checkOut, guests });
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestCount = parseInt(guests);

    const filter = { capacity: { $gte: guestCount } };
    if (roomTypeId) filter._id = roomTypeId;

    const roomTypes = await RoomType.find(filter);
    console.log('Service:getAvailableRooms roomTypes found', { count: roomTypes.length });
    const availableRooms = [];

    for (const roomType of roomTypes) {
      // Do not restrict by status "available" here, because "booked" is not time-aware.
      // Exclude only maintenance rooms and compute availability by date overlaps below.
      const rooms = await Room.find({
        roomType: roomType._id,
        status: { $ne: "maintenance" },
      });
      console.log('Service:getAvailableRooms rooms for type', { roomTypeId: roomType._id, rooms: rooms.length });
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
          console.log('Service:getAvailableRooms conflict for room', { roomId: room._id });
        }
      }
    }

    console.log('Service:getAvailableRooms result', { available: availableRooms.length });
    return availableRooms;
  } catch (error) {
    console.error('Service:getAvailableRooms error', error);
    throw error;
  }
};
