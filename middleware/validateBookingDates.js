// middleware/validateBookingDates.js
const validateBookingDates = (req, res, next) => {
  // Accept both legacy keys (checkInDate/checkOutDate) and current keys (checkIn/checkOut)
  const { checkInDate, checkOutDate, checkIn, checkOut } = req.body;

  const ci = checkIn ?? checkInDate;
  const co = checkOut ?? checkOutDate;

  if (!ci || !co) {
    return res
      .status(400)
      .json({ message: "Check-in and check-out dates are required." });
  }

  const checkInParsed = new Date(ci);
  const checkOutParsed = new Date(co);

  if (isNaN(checkInParsed) || isNaN(checkOutParsed)) {
    return res.status(400).json({ message: "Invalid date format." });
  }

  if (checkOutParsed <= checkInParsed) {
    return res
      .status(400)
      .json({ message: "Check-out date must be after check-in date." });
  }

  // Normalize keys for downstream services
  req.body.checkIn = ci;
  req.body.checkOut = co;

  // If all checks pass
  next();
};

module.exports = { validateBookingDates };
