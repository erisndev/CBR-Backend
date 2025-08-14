// utils/generateReference.js
const crypto = require("crypto");

const generateReference = () => {
  return crypto.randomBytes(8).toString("hex");
};

module.exports = generateReference;
