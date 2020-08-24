const express = require("express");
const config = require("../config/config");
const http = require("http");
const https = require("https");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const passport = require("../middleware/passport");
const paymentController = require("../controller/payment.controller");
const Order = require("../models/order.model");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const payPalClient = require("../controller/payPalClient");
const { findOneAndUpdate } = require("../models/order.model");
const { order } = require("paypal-rest-sdk");
const { consoleTestResultHandler } = require("tslint/lib/test");
const { throwError } = require("rxjs");

router.get("", async (req, res, next) => {
  // !!!!!!! ADD AUTHORIZATION (check for role) !!!!!!!
  orders = await Order.find();
  if (orders) {
    res.status(201).json(orders);
  } else {
    res.status(404).json({ message: "Orders not found!" });
  }
});

router.get("/:id", async (req, res, next) => {
  // !!!!!!! ADD AUTHORIZATION (check for role) !!!!!!!
  orderFromDB = await Order.findOne({ orderId: req.params.id });

  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(req.params.id);

  try {
    let order = await payPalClient
      .client()
      .execute(request)
      .catch((err) => {
        console.log("ERROR CAUGHT");
        throw err;
      });
    orderFromDB.paymentStatus = order.result.status;
    orderFromDB.shipping = order.result.purchase_units[0].shipping;
  } catch (err) {
    console.log("YEP");
  }

  // console.log(order.result.purchase_units[0].shipping);
  res.status(201).json(orderFromDB);
});

router.post("/update", async (req, res, next) => {
  // !!!!!!! ADD AUTHORIZATION (check for role) !!!!!!!
  let order = req.body;
  orderRes = await Order.findOneAndUpdate(
    { orderId: order.orderId },
    { orderItems: order.orderItems },
    { orderStatus: order.orderStatus }
  );
  if (orderRes) {
    res.status(201).json({ message: "Order updated successfully" });
  } else {
    res.status(500).json({ message: "Error in updating cart!" });
  }
});

module.exports = router;
