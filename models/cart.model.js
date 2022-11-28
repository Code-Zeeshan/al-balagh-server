const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    // userId: { type: String, required: true },
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.ObjectId,
          ref: "Product",
        },
        count: {
          type: Number,
          // default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);