const express = require("express");
const asyncHandler = require("express-async-handler");

const userController = require("../controller/user.controller");

const router = express.Router();

router.post("/register", asyncHandler(insert));
router.post("/login", asyncHandler(getUserByEmailIdAndPassword));

async function insert(req, res, next) {
  const savedUser = req.body;
  console.log(`registering user`, savedUser);
  const user = userController.insert(savedUser);
  res.json(user);
}

async function getUserByEmailIdAndPassword(req, res, next) {
  const user = req.body;
  console.log(`searching user for `, user);

  const savedUser = await userController.getUserByEmailIdAndPassword(
    user.email,
    user.password
  );
  res.json(savedUser);
}

module.exports = router;
