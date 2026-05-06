const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const OTP = require("../models/otpModel");
const { sendOTPEmail } = require("../utils/email");


const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });
    await OTP.deleteMany({
      email,
      action: "account_verification",
    });
    await OTP.create({
      email,
      otp,
      action: "account_verification",
    });
    await sendOTPEmail(
      email,
      otp,
      "account_verification"
    );
    res.status(201).json({
      message:
        "User registered successfully. Please verify OTP sent to your email.",
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    if (!user.isVerified && user.role === "user") {
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await OTP.deleteMany({
        email,
        action: "account_verification",
      });
      await OTP.create({
        email,
        otp,
        action: "account_verification",
      });
      await sendOTPEmail(
        email,
        otp,
        "account_verification"
      );
      return res.status(400).json({
        message:
          "Please verify your account first. OTP sent again.",
      });
    }
    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });
      return res.status(400).json({
        message: "OTP expired",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.isVerified = true;
    await user.save();
    await OTP.deleteOne({
      _id: otpRecord._id,
    });
    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
};