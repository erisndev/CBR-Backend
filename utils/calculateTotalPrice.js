// utils/calculateTotalPrice.js

const calculateTotalPrice = (pricePerNight, checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  // Calculate total nights
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return pricePerNight * diffDays;
};

module.exports = calculateTotalPrice;
