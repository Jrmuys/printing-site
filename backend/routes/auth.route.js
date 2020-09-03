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

  await userController
    .insert(savedUser)
    .then(async (user) => {
      if (user) {
        req.user = user;
        foundUser = await userController.getUserByEmail(req.user.email);
        req.user = foundUser;
        cartController.createCart(foundUser._id);
        next();
      } else {
        res.status(500).json({ message: "User does not exist!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

function test(req, res, next) {
  next();
}

function login(req, res) {
  const expiresIn = config.expiresIn;
  const user = req.user;
  const token = authController.generateToken(user);
  res.json({ user, token, expiresIn });
}

module.exports = router;
