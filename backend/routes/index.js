const express = require("express");

const authRoutes = require("./auth.route");
const modelRoutes = require("./model.route");
const cartRoutes = require("./cart.route");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/model", modelRoutes);

router.use("/cart", cartRoutes);
module.exports = router;
