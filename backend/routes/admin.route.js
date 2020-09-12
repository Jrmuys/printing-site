const express = require("express");
const config = require("../config/config");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const passport = require("../middleware/passport");
const paymentController = require("../controller/payment.controller");
const Order = require("../models/order.model");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const payPalClient = require("../controller/paypalClient");

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
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    orders = await Order.find({ userId: req.user._id });
    if (orders) {
      res.status(201).json(orders);
    } else {
      res.status(404).json({ message: "Orders not found!" });
    }
  }
);

router.get(
  "/order/:id",
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
      ).catch((err) => {
        res.status(500).json({
          message: "An error in updating the order occurred",
          error: err,
        });
      });
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
