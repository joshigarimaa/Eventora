const express = require("express");

const { authMiddleware, admin } = require("../middlewares/auth");

const {
  bookEvent,
  sendBookingOTP,
  getMyBookings,
  cancelBookings,
  confirmBooking,
} = require("../controllers/bookingController.js");

const router = express.Router();

router.post("/", authMiddleware, bookEvent);

router.post("/send-otp", authMiddleware, sendBookingOTP);

router.get("/my", authMiddleware, getMyBookings);

router.delete("/:id", authMiddleware, cancelBookings);

router.put("/:id/confirm", authMiddleware, admin, confirmBooking);

module.exports = router;
