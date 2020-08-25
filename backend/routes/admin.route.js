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

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (req.user.roles[0] == "admin") {
      orders = await Order.find();
      if (orders) {
        res.status(201).json(orders);
      } else {
        res.status(404).json({ message: "Orders not found!" });
      }
    } else {
      res.status(403).json({ message: "Not authorized for this action!" });
    }
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    orderFromDB = await Order.findOne({ orderId: req.params.id });
    if (req.user.roles[0] == "admin" || req.user._id == orderFromDB.userId) {
      let request = new checkoutNodeJssdk.orders.OrdersGetRequest(
        req.params.id
      );

      try {
        let order = await payPalClient
          .client()
          .execute(request)
          .catch((err) => {
            console.log("ERROR CAUGHT");
            throw err;
          });
        orderFromDB.paymentDetails.paymentStatus = order.result.status;
        orderFromDB.shipping = order.result.purchase_units[0].shipping;
      } catch (err) {
        console.log("YEP");
      }

      // console.log(order.result.purchase_units[0].shipping);
      res.status(201).json(orderFromDB);
    } else {
      res.status(403).json({ message: "Not authorized for this action!" });
    }
  }
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (req.user.roles[0] == "admin") {
      let order = req.body;
      console.log(order.orderStatus);
      orderRes = await Order.findOneAndUpdate(
        { orderId: order.orderId },
        { orderItems: order.orderItems, orderStatus: order.orderStatus }
      );
      if (orderRes) {
        res.status(201).json({ message: "Order updated successfully" });
      } else {
        res.status(500).json({ message: "Error in updating cart!" });
      }
    } else {
      res.status(403).json({ message: "Not authorized for this action!" });
    }
  }
);

module.exports = router;
