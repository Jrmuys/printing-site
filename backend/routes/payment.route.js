const express = require("express");
const config = require("../config/config");
const http = require("http");
const https = require("https");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const passport = require("../middleware/passport");
const paymentController = require("../controller/payment.controller");

router.post(
  "/get-transaction",

  asyncHandler(insert)
);

async function insert(req, res, next) {
  await paymentController.handleRequest(req, res).catch((err) => {
    res.status(500).json({ message: "an error occurred", error: err });
  });
}

module.exports = router;
