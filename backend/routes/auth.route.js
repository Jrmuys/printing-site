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
    .then((user) => {
      if (user) {
        req.user = user;
        userController
          .getUserByEmail(req.user.email)
          .next((foundUser) => {
            req.user = foundUser;
            cartController.createCart(foundUser._id);
            next();
          })
          .catch((err) => {
            res.status(500).json({ message: "Could not find user!" });
          });
      } else {
        res.status(500).json({ message: "User does not exist!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
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
  next();
}

function login(req, res) {
  const expiresIn = config.expiresIn;
  const user = req.user;
  const token = authController.generateToken(user);
  res.json({ user, token, expiresIn });
}

module.exports = router;
