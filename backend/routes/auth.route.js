const express = require("express");
const userController = require("../controller/user.controller");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.post("/register", asyncHandler(insert));

async function insert(req, res, next) {
  const savedUser = req.body;
  console.log(`registering user`, savedUser);
  const user = userController.insert(savedUser);
  res.json(user);
}

module.exports = router;
