const express = require("express");
const router = express.Router();
const { authMiddleware, admin } = require("../middlewares/auth");
const Event = require("../models/eventModel");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authMiddleware, admin, createEvent);
router.put("/:id", authMiddleware, admin, updateEvent);
router.delete("/:id", authMiddleware, admin, deleteEvent);


module.exports = router;