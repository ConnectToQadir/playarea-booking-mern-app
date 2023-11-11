process.env.TZ = "Asia/Karachi";
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");



app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const playAreasRoutes = require("./routes/playareas");
const bookingsRoutes = require("./routes/bookings");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/playareas", playAreasRoutes);
app.use("/api/bookings", bookingsRoutes);

app.get("/", function (req, res) {
  res.send("Welcome to Playease, Server is Running...");
});

mongoose
  .connect("mongodb+srv://info:Y8gORoh2XZzPKufo@edify-college.ajku8l8.mongodb.net/playease?retryWrites=true&w=majority")
  .then(() => console.log("Connected!"))
  .catch(() => {
    console.log("Note Connected!");
  });

app.listen(4600, () => {
  console.log("server is running...");
});




