const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
      required: [true, "please add a name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "please add a category"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "please add a price"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "please add a quantity"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "please add a description"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
