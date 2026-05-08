const bookingModel = require("../models/bookingModel");
const eventModel = require("../models/eventModel");
const OTP = require("../models/otpModel");
const { sendOTPEmail, sendBookingEmail } = require("../utils/email");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendBookingOTP = async (req, res) => {
  const otp = generateOTP();

  await OTP.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });

  await OTP.create({
    email: req.user.email,
    otp,
    action: "event_booking",
  });

  await sendOTPEmail(req.user.email, otp, "event_booking");

  res.status(200).json({
    message: "OTP sent to email",
  });
};

exports.bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;

  const otpRecord = await OTP.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });

  if (!otpRecord) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const event = await eventModel.findById(eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  if (event.availableSeats <= 0) {
    return res.status(400).json({
      message: "No seats available",
    });
  }

  const existingBooking = await bookingModel.findOne({
    user: req.user._id,
    event: eventId,
  });

  if (existingBooking) {
    return res.status(400).json({
      message: "You have already booked this event",
    });
  }

  const booking = await bookingModel.create({
    user: req.user._id,
    event: eventId,
    status: "pending",
    paymentStatus: "not_paid",
    amount: event.price,
  });

  await OTP.deleteMany({
    email: req.user.email,
    action: "event_booking",
  });

  await sendBookingEmail(req.user.email, event.title, booking._id);

  res.status(201).json({
    message: "Booking created",
    bookingId: booking._id,
  });
};

exports.confirmBooking = async (req, res) => {
  const paymentStatus = req.body.paymentStatus;

  if (paymentStatus !== "paid") {
    return res.status(400).json({
      message: "Payment not successful",
    });
  }

  const booking = await bookingModel.findById(req.params.id).populate("event");

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }

  if (booking.status === "confirmed") {
    return res.status(400).json({
      message: "Booking already confirmed",
    });
  }

  const event = await eventModel.findById(booking.event._id);

  if (event.availableSeats <= 0) {
    return res.status(400).json({
      message: "No seats available",
    });
  }

  booking.status = "confirmed";

  if (paymentStatus === "paid") {
    booking.paymentStatus = "paid";
  }

  await booking.save();

  booking.event.availableSeats -= 1;

  await booking.event.save();
  await sendBookingEmail(booking.user.email, event.title, booking._id, true);

  res.status(200).json({
    message: "Booking confirmed",
  });
};

exports.getMyBookings = async (req, res) => {
  const bookings = await bookingModel
    .find({ user: req.user._id })
    .populate("eventId");
  res.status(200).json({
    bookings,
  });
};

exports.cancelBookings = async (req, res) => {
  const booking = await bookingModel.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }
  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }                    
  if (booking.status === "cancelled") {
    return res.status(400).json({
      message: "Booking already cancelled",
    });
  }
  if (booking.status === "confirmed") {
    const event = await eventModel.findById(booking.eventId);
    event.availableSeats += 1;
    await event.save();
  }
  booking.status = "cancelled";
  await booking.save();
  booking.event.availableSeats += 1;
  await booking.event.save();
  res.status(200).json({
    message: "Booking cancelled",
  });
};
