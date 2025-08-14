// middleware/validateRoomCapacity.js
const validateRoomCapacity = (req, res, next) => {
  const { guests, roomCapacity } = req.body;

  if (guests == null || roomCapacity == null) {
    return res
      .status(400)
      .json({ message: "Guests and room capacity are required." });
  }

  if (typeof guests !== "number" || typeof roomCapacity !== "number") {
    return res
      .status(400)
      .json({ message: "Guests and room capacity must be numbers." });
  }

  if (guests > roomCapacity) {
    return res
      .status(400)
      .json({ message: "Number of guests exceeds room capacity." });
  }

  // If all checks pass
  next();
};

module.exports = { validateRoomCapacity };
