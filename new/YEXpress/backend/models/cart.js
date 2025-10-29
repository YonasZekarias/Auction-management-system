const mongoose = require("mongoose");
const Product = require("./product");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      rquired: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  totalSum : {
    type : Number,
    required : true,
    default : 0
  }
});

cartSchema.index({customerId : 1, Product})

module.exports = mongoose.model("cart",cartSchema);