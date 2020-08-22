const mongoose = require("mongoose");
const CartItem = require("./cart-item.model");

const OrderSchema = new mongoose.Schema({
  orderItems: { type: [CartItem()], required: false },
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
