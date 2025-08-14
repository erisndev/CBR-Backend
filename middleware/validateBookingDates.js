// middleware/validateBookingDates.js
const validateBookingDates = (req, res, next) => {
  const { checkInDate, checkOutDate } = req.body;

  if (!checkInDate || !checkOutDate) {
    return res
      .status(400)
      .json({ message: "Check-in and check-out dates are required." });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    return res.status(400).json({ message: "Invalid date format." });
  }

  if (checkOut <= checkIn) {
    return res
      .status(400)
      .json({ message: "Check-out date must be after check-in date." });
  }

  // If all checks pass
  next();
};

module.exports = { validateBookingDates };
