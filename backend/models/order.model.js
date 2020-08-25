const mongoose = require("mongoose");
const CartItem = require("./cart-item.model");

const OrderSchema = new mongoose.Schema({
  orderItems: { type: [CartItem()], required: false },
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  date: { type: Date, required: true },
  orderStatus: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  paymentDetails: {
    totalPrice: { type: String, required: true },
    shipping: { type: String, required: true },
    tax: { type: String, required: true },
    paymentStatus: { type: String, required: true },
  },
  shipping: {
    address: {
      address_line_1: { type: String },
      address_line_2: { type: String },
      admin_area_2: { type: String },
      admin_area_1: { type: String },
      postal_code: { type: String },
      country_code: { type: String },
    },
  },
});

module.exports = mongoose.model("Order", OrderSchema);
