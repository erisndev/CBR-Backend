const nodemailer = require("nodemailer");

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Booking Confirmation Email
const sendBookingConfirmation = async (booking) => {
  const {
    guestDetails,
    checkIn,
    checkOut,
    totalPrice,
    payment,
    room,
    specialRequests,
  } = booking;

  // Generate dynamic HTML using your template
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Coastal Beach Resort</title>
      <style> * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f8fafc; color: #334155; } .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); } .header { background: linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden; } .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="palm" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M20 10 Q25 5 30 10 Q25 15 20 10 M20 30 Q15 25 10 30 Q15 35 20 30" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23palm)"/></svg>') repeat; opacity: 0.1; } .header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 1; } .header .subtitle { color: #ddd6fe; font-size: 18px; position: relative; z-index: 1; } .status-badge { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .content { padding: 40px 30px; } .section { margin-bottom: 40px; } .section-title { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #e2e8f0; position: relative; } .section-title::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 50px; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); } .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; } .info-card { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #3b82f6; transition: transform 0.3s ease; } .info-card:hover { transform: translateY(-2px); } .info-card h3 { color: #1e293b; font-size: 18px; font-weight: 600; margin-bottom: 15px; } .info-item { margin-bottom: 12px; } .info-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: block; } .info-value { font-size: 16px; font-weight: 600; color: #1e293b; } .highlight-section { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 20px; border: 2px solid #f59e0b; margin: 30px 0; text-align: center; } .total-amount { font-size: 42px; font-weight: 800; color: #92400e; margin-bottom: 10px; } .payment-ref { background-color: #ffffff; padding: 15px 20px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 16px; color: #374151; border: 2px dashed #d1d5db; margin-top: 15px; } .booking-summary { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #2563eb; } .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(37, 99, 235, 0.1); } .summary-item:last-child { border-bottom: none; font-weight: 700; font-size: 18px; color: #1d4ed8; } .special-requests { background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #8b5cf6; font-style: italic; color: #6b21a8; } .footer { background-color: #1f2937; padding: 40px 30px; text-align: center; color: #d1d5db; } .footer h3 { color: #ffffff; margin-bottom: 20px; font-size: 20px; } .contact-info { margin-bottom: 20px; line-height: 1.8; } .social-links { margin-top: 30px; } .social-links a { display: inline-block; width: 40px; height: 40px; background-color: #374151; color: #ffffff; border-radius: 50%; text-decoration: none; margin: 0 10px; line-height: 40px; transition: background-color 0.3s ease; } .social-links a:hover { background-color: #3b82f6; } .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 20px 0; transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); } .cta-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); } @media (max-width: 640px) { .email-container { margin: 0; box-shadow: none; } .header, .content, .footer { padding: 20px 15px; } .header h1 { font-size: 24px; } .info-grid { grid-template-columns: 1fr; gap: 15px; } .total-amount { font-size: 32px; } } </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🏖️ Coastal Beach Resort</h1>
          <p class="subtitle">Your tropical escape awaits</p>
          <div class="status-badge">✓ CONFIRMED</div>
        </div>

        <div class="content">
          <!-- Welcome Message -->
          <div class="section">
            <h2 style="font-size: 28px; color: #1e293b; margin-bottom: 15px;">Booking Confirmed!</h2>
            <p style="font-size: 16px; color: #64748b; line-height: 1.7;">
              Dear ${guestDetails.firstName} ${guestDetails.lastName},<br><br>
              Thank you for choosing Coastal Beach Resort for your upcoming stay! We're thrilled to have you as our guest and look forward to providing you with an unforgettable experience.
            </p>
          </div>

          <!-- Guest Information -->
          <div class="section">
            <h2 class="section-title">Guest Information</h2>
            <div class="info-grid">
              <div class="info-card">
                <h3>Personal Details</h3>
                <div class="info-item"><span class="info-label">Full Name</span><span class="info-value">${
                  guestDetails.firstName
                } ${guestDetails.lastName}</span></div>
                <div class="info-item"><span class="info-label">Email</span><span class="info-value">${
                  guestDetails.email
                }</span></div>
                <div class="info-item"><span class="info-label">Phone</span><span class="info-value">${
                  guestDetails.phone || "Not provided"
                }</span></div>
              </div>
              
              <div class="info-card">
                <h3>Address Details</h3>
                <div class="info-item"><span class="info-label">Address</span><span class="info-value">${
                  guestDetails.address || "Not provided"
                }</span></div>
                <div class="info-item"><span class="info-label">City</span><span class="info-value">${
                  guestDetails.city || "Not provided"
                }</span></div>
                <div class="info-item"><span class="info-label">Country</span><span class="info-value">${
                  guestDetails.country || "Not provided"
                }</span></div>
              </div>
            </div>
          </div>

          <!-- Booking Details -->
          <div class="section">
            <h2 class="section-title">Booking Details</h2>
            <div class="info-grid">
              <div class="info-card">
                <h3>Stay Information</h3>
                <div class="info-item"><span class="info-label">Room Type</span><span class="info-value">${
                  room?.name || "N/A"
                }</span></div>
                <div class="info-item"><span class="info-label">Check In</span><span class="info-value">${new Date(
                  checkIn
                ).toLocaleDateString()}</span></div>
                <div class="info-item"><span class="info-label">Check Out</span><span class="info-value">${new Date(
                  checkOut
                ).toLocaleDateString()}</span></div>
                <div class="info-item"><span class="info-label">Duration</span><span class="info-value">${Math.ceil(
                  (new Date(checkOut) - new Date(checkIn)) /
                    (1000 * 60 * 60 * 24)
                )} nights</span></div>
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="section">
            <h2 class="section-title">Payment Summary</h2>
            <div class="highlight-section">
              <div style="margin-bottom: 20px;"><span style="font-size: 18px; color: #92400e; font-weight: 600;">Total Amount</span></div>
              <div class="total-amount">R${totalPrice}</div>
              <div style="font-size: 16px; color: #92400e; font-weight: 500;">Payment Status: ${booking.status.toUpperCase()}</div>
              <div class="payment-ref">Reference: ${payment?.reference}</div>
            </div>
          </div>

          <!-- Special Requests -->
          ${
            specialRequests
              ? `<div class="section"><h2 class="section-title">Special Requests</h2><div class="special-requests">${specialRequests}</div></div>`
              : ""
          }

          
        </div>

        
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Coastal Beach Resort" <${process.env.EMAIL_USER}>`,
    to: guestDetails.email,
    cc: process.env.ADMIN_EMAIL,
    subject: "Booking Confirmation - Coastal Beach Resort",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };
