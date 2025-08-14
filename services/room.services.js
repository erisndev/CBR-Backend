// services/roomService.js
const Room = require("../models/room.model.js");
const RoomType = require("../models/roomtype.model.js");

const createRoomType = async (data) => {
  const roomType = await RoomType.create(data);

  // Auto-create Room units
  const rooms = [];
  for (let i = 1; i <= roomType.totalUnits; i++) {
    rooms.push({
      roomType: roomType._id,
      unitCode: `${roomType.name.replace(/\s+/g, "-")}-${i}`,
      status: "available",
    });
  }
  await Room.insertMany(rooms);

  return roomType;
};

const getAllRoomTypes = async () => {
  return await RoomType.find();
};

const updateRoomType = async (roomTypeId, data) => {
  return await RoomType.findByIdAndUpdate(roomTypeId, data, { new: true });
};

const createRoomUnits = async (roomTypeId, totalUnits) => {
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new Error("RoomType not found");

  const existingRooms = await Room.find({ roomType: roomTypeId });
  const roomsToCreate = totalUnits - existingRooms.length;
  if (roomsToCreate <= 0) return existingRooms;

  const rooms = [];
  for (let i = existingRooms.length + 1; i <= totalUnits; i++) {
    rooms.push({
      roomType: roomType._id,
      unitCode: `${roomType.name.replace(/\s+/g, "-")}-${i}`,
      status: "available",
    });
  }

  const newRooms = await Room.insertMany(rooms);
  return [...existingRooms, ...newRooms];
};

const deleteRoomType = async (roomTypeId) => {
  // Delete all rooms first
  await Room.deleteMany({ roomType: roomTypeId });
  // Delete room type
  return await RoomType.findByIdAndDelete(roomTypeId);
};
const getRoomTypesWithAvailability = async () => {
  const roomTypes = await RoomType.find();
  const rooms = await Room.find();

  return roomTypes.map((rt) => {
    const availableUnits = rooms.filter(
      (r) =>
        r.roomType.toString() === rt._id.toString() && r.status === "available"
    ).length;

    return {
      ...rt.toObject(),
      availableUnits,
    };
  });
};

module.exports = {
  createRoomType,
  getAllRoomTypes,
  updateRoomType,
  createRoomUnits,
  deleteRoomType,
  getRoomTypesWithAvailability,
};
