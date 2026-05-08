const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "confirmed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["non_paid", "paid"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
