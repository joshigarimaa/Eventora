const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp, type) => {
  const mailOptions = {
    from: `"Eventora" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `OTP for ${type} - Eventora`,
    html: `
      <h2>Eventora Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email} for ${type}`);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmation for ${eventTitle} - Eventora`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your booking for the event <strong>${eventTitle}</strong> has been confirmed.</p>
        <p>Thank you for using Eventora!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(
      `Booking confirmation sent to ${userEmail} for ${eventTitle}`
    );
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

module.exports = {
  sendOTPEmail,
  sendBookingEmail,
};