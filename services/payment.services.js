// services/paymentService.js
const axios = require("axios");

const initializePayment = async ({ email, amount, reference }) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    { email, amount, reference },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const verifyPayment = async (reference) => {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};

module.exports = {
  initializePayment,
  verifyPayment,
};
