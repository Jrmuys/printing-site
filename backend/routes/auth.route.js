const express = require("express");
const asyncHandler = require("express-async-handler");

const config = require("../config/config");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const cartController = require("../controller/cart.controller.js");
const passport = require("../middleware/passport");

const router = express.Router();

router.post("/register", asyncHandler(insert), login);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.get(
  "/findme",
  test,
  passport.authenticate("jwt", { session: false }),
  login
);

async function insert(req, res, next) {
  const savedUser = req.body;
  console.log(`registering user`, savedUser);

  req.user = await userController.insert(savedUser);
  console.log("User saved...", req.user);
  foundUser = await userController.getUserByEmail(req.user.email);
  req.user = foundUser;
  cartController.createCart(foundUser._id);
  next();
}

// async function getUserByEmailIdAndPassword(req, res, next) {
//   const user = req.body;
//   console.log(`searching user for `, user);

//   const savedUser = await userController.getUserByEmailIdAndPassword(
//     user.email,
//     user.password
//   );
//   req.user = savedUser;
//   next();
// }

function test(req, res, next) {
  console.log("test...");
  next();
}

function login(req, res) {
  const expiresIn = config.expiresIn;
  console.log("Expires in : ", expiresIn);
  const user = req.user;
  console.log("loggin in user:", user);
  const token = authController.generateToken(user);
  console.log("User: ", user);
  console.log("Token", token);
  res.json({ user, token, expiresIn });
}

module.exports = router;
