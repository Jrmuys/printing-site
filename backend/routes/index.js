const express = require("express");

const authRoutes = require("./auth.route");
const modelRoutes = require("./model.route");
const cartRoutes = require("./cart.route");
const paymentRoutes = require("./payment.route");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/model", modelRoutes);

router.use("/cart", cartRoutes);

router.use("/payment", paymentRoutes);
module.exports = router;
