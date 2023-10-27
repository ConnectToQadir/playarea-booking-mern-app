const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
  bookingUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  playarea: {
    type: Schema.Types.ObjectId,
    ref: "playareas",
    required: true,
  },
  bookingDate:{
    type:Date,
    required:true
  },
  price: {
    type: Number,
    required: true,
  },
  startTime:{
    type:String,
    required:true,
  },
  endTime:{
    type:String,
    required:true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model("bookings", bookingsSchema);
