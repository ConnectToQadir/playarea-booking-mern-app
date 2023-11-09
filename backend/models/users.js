const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "owner", "admin"],
    default: "customer",
    required: true,
  },
  phone: {
    type: String
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  photo: { type: String, default: "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg" },
  isActive: {
    type: Boolean,
    default: true,
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model("users", userSchema);
