const express = require("express");
const asyncHandler = require("express-async-handler");

const config = require("../config/config");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const passport = require("../middleware/passport");

const router = express.Router();

router.post("/register", asyncHandler(insert), login);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
router.get("/findme", passport.authenticate("jwt", { session: false }), login);

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
  const expiresIn = config.expiresIn;
  console.log("Expires in : ", expiresIn);
  const user = req.user;
  const token = authController.generateToken(user);
  console.log("User: ", user);
  console.log("Token", token);
  res.json({ user, token, expiresIn });
}

module.exports = router;
