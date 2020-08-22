const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const CartItem = require("../models/cart-item.model");
const cartController = require("../controller/cart.controller");
const multer = require("multer");
const passport = require("../middleware/passport");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let host = req.get("host");
    // console.log(" Req. body", req.body);
    cartController.addToCart(req, res, next, host);
  }
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    cartController.updateCart(req, res, next);
  }
);

router.get(
  "",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    cartController.getCart(req, res, next);
  }
);

router.delete(
  "/clear",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    cartController.clear(req, res, next);
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    cartController.deleteItem(req, res, next);
  }
);

router.post("", (req, res, next) => {
  console.log("Test", req);
});

module.exports = router;
