// routes/room.routes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller.js");

// RoomType CRUD
router.post("/room-types", roomController.createRoomType);
router.get("/room-types", roomController.getAllRoomTypes);
router.put("/room-types/:id", roomController.updateRoomType);
router.delete("/room-types/:id", roomController.deleteRoomType);

// Room units
router.post("/rooms", roomController.createRoomUnits);
router.get("/rooms", roomController.getAvailableRooms);

module.exports = router;
