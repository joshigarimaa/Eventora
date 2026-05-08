const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});