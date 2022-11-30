const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: Number,
      default: 2345,
    },
    refreshToken: { type: String },
    img: { type: String },
    contact: { type: String },
    address: { type: String },
    city: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);