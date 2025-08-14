const roomService = require("../services/room.services.js");
const Room = require("../models/room.model.js");
const RoomType = require("../models/roomtype.model.js");

const createRoomType = async (req, res) => {
  try {
    const roomType = await roomService.createRoomType(req.body);
    res.status(201).json(roomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await roomService.getRoomTypesWithAvailability();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoomType = async (req, res) => {
  try {
    const updatedRoomType = await roomService.updateRoomType(
      req.params.id,
      req.body
    );
    if (!updatedRoomType) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json(updatedRoomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createRoomUnits = async (req, res) => {
  try {
    const { roomTypeId, totalUnits } = req.body;
    const rooms = await roomService.createRoomUnits(roomTypeId, totalUnits);
    res.status(201).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const { roomTypeId, checkIn, checkOut } = req.query;
    const availableRooms = await roomService.getAvailableRooms(
      roomTypeId,
      checkIn,
      checkOut
    );
    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoomType = async (req, res) => {
  try {
    const deleted = await roomService.deleteRoomType(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json({ message: "Room type and all its rooms deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoomType,
  getAllRoomTypes,
  updateRoomType,
  createRoomUnits,
  getAvailableRooms,
  deleteRoomType,
};
