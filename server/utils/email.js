const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be App Password
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

const sendOTPEmail=async(email,otp,type)=>{
    try {
        
    } catch (error) {
        
    }
}

module.exports = sendOTPEmail;