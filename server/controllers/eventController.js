const event = require("../models/eventModel");

exports.getAllEvents = async (req, res) => {
  try {
    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.location) {
      filters.location = req.query.location;
    }

    if (req.query.ticketPrice) {
      filters.ticketPrice = { $lte: req.query.ticketPrice };
    }

    const events = await event.find(filters);

    res.status(200).json({
      status: "success",
      results: events.length,
      data: {
        events,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = await event.findById(eventId);

    if (!eventData) {
      return res.status(404).json({
        status: "fail",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        event: eventData,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      imageUrl,
      location,
      totalSeats,
      category,
      ticketPrice,
    } = req.body;

    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !totalSeats ||
      !category ||
      !ticketPrice ||
      !imageUrl
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    const newEvent = await event.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        event: newEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      imageUrl,
      location,
      totalSeats,
      category,
      ticketPrice,
    } = req.body;

    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !totalSeats ||
      !category ||
      !ticketPrice ||
      !imageUrl
    ) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    const eventId = req.params.id;

    const updatedEvent = await event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        status: "fail",
        message: "Event not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        event: updatedEvent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        status: "fail",
        message: "Event not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};