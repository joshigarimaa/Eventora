const event = require("../models/eventModel");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await event.find();
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
