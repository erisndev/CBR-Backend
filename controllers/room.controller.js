const roomService = require("../services/room.services.js");
const Room = require("../models/room.model.js");
const RoomType = require("../models/roomtype.model.js");

const createRoomType = async (req, res) => {
  try {
    console.log("Controller:createRoomType called", { body: req.body });
    const roomType = await roomService.createRoomType(req.body);
    res.status(201).json(roomType);
  } catch (error) {
    console.error("Controller:createRoomType error", error);
    res.status(400).json({ message: error.message });
  }
};

const getAllRoomTypes = async (req, res) => {
  try {
    console.log("Controller:getAllRoomTypes called");
    const roomTypes = await roomService.getRoomTypesWithAvailability();
    res.json(roomTypes);
  } catch (error) {
    console.error("Controller:getAllRoomTypes error", error);
    res.status(500).json({ message: error.message });
  }
};

const updateRoomType = async (req, res) => {
  try {
    console.log("Controller:updateRoomType called", { id: req.params.id, body: req.body });
    const updatedRoomType = await roomService.updateRoomType(
      req.params.id,
      req.body
    );
    if (!updatedRoomType) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json(updatedRoomType);
  } catch (error) {
    console.error("Controller:updateRoomType error", error);
    res.status(400).json({ message: error.message });
  }
};

const createRoomUnits = async (req, res) => {
  try {
    console.log("Controller:createRoomUnits called", { body: req.body });
    const { roomTypeId, totalUnits } = req.body;
    const rooms = await roomService.createRoomUnits(roomTypeId, totalUnits);
    res.status(201).json(rooms);
  } catch (error) {
    console.error("Controller:createRoomUnits error", error);
    res.status(400).json({ message: error.message });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const { roomTypeId, checkIn, checkOut, guests } = { ...req.query, ...req.body };
    console.log("Controller:getAvailableRooms called", { roomTypeId, checkIn, checkOut, guests });
    if (!checkIn || !checkOut)
      return res
        .status(400)
        .json({ message: "Check-in and check-out required" });

    const totalGuests = parseInt(guests, 10) || 1;
    const rooms = await roomService.getAvailableRooms(
      roomTypeId && roomTypeId !== "null" ? roomTypeId : null,
      checkIn,
      checkOut,
      totalGuests
    );
    res.json(rooms);
  } catch (error) {
    console.error("Controller:getAvailableRooms error", error);
    res.status(500).json({ message: "Failed to fetch available rooms" });
  }
};

const deleteRoomType = async (req, res) => {
  try {
    console.log("Controller:deleteRoomType called", { id: req.params.id });
    const deleted = await roomService.deleteRoomType(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json({ message: "Room type and all its rooms deleted successfully" });
  } catch (error) {
    console.error("Controller:deleteRoomType error", error);
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
