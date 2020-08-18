const express = require("express");
const asyncHandler = require("express-async-handler");

const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");

const router = express.Router();

router.post("/register", asyncHandler(insert), login);
router.post("/login", asyncHandler(getUserByEmailIdAndPassword), login);

async function insert(req, res, next) {
  const savedUser = req.body;
  console.log(`registering user`, savedUser);
  req.user = await userController.insert(savedUser);

  next();
}

async function getUserByEmailIdAndPassword(req, res, next) {
  const user = req.body;
  console.log(`searching user for `, user);

  const savedUser = await userController.getUserByEmailIdAndPassword(
    user.email,
    user.password
  );
  req.user = savedUser;
  next();
}

function login(req, res) {
  const user = req.user;
  const token = authController.generateToken(user);
  res.json({ user, token });
}

module.exports = router;
