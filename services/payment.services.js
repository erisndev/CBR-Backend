const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize payment
const initializePayment = async ({ email, amount, reference }) => {
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

  return response.data.data; // includes authorization_url, access_code, reference
};

// Verify payment
const verifyPayment = async (reference) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    }
  );

  return response.data.data; // returns Paystack transaction info
};

module.exports = {
  initializePayment,
  verifyPayment,
};
