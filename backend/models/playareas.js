const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playareaSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  size: {
    type: String,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  images: {
    type: [String],
    required: true,
  },
  facilities: [String],
  openingHours: {
    type: [
      {
        day: {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
    validate: {
      validator: function (array) {
        return array.length > 0; // Custom validation logic to check if the array has at least one item.
      },
      message: "Please Enter Atleast One Opening Slot!",
    },
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["Playground", "Playland", "Playstation", "Farmhouse"],
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reviews: [
    {
      commentingUser: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      NoOfreviews: {
        type: Number,
        required:true
      },
      comment: {
        type: String,
        required:true
      },
      commentDate:{
        type:Date,
        default:Date.now,
        required:true
      }
    },
  ],
});

module.exports = mongoose.model("playareas", playareaSchema);
