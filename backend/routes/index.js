const express = require("express");

const authRoutes = require("./auth.route");
const modelRoutes = require("./model.route");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/model", modelRoutes);

module.exports = router;
