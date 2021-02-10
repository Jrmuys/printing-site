const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const CartItem = require("../models/cart-item.model");
const cartController = require("../controller/cart.controller");
const multer = require("multer");
const passport = require("../middleware/passport");
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const config = require("../config/config")

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   },
// });

AWS.config.update({
  accessKeyId: config.s3AccessKeyID,
  secretAccessKey: config.s3SecretAcessKey,
  signatureVersion: 'v4',
});

const S3 = new AWS.S3();
const isAllowedMimetype = (mime) =>
  [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/x-ms-bmp',
    'image/webp',
  ].includes(mime.toString());
const fileFilter = (
  req,
  file,
  callback
) => {
  const fileMime = file.mimetype;
  if (isAllowedMimetype(fileMime)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const getUniqFileName = (originalname) => {
  const name = uuid();
  const ext = originalname.split('.').pop();
  return `${name}.${ext}.png`;
};

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  multer({
    fileFilter,
    storage: multerS3({
      s3: S3,
      bucket: config.s3BucketName,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const fileName = getUniqFileName(file.originalname);
        const s3_inner_directory = 'model_files';
        const finalPath = `${s3_inner_directory}/${fileName}`;

        file.newName = fileName;

        cb(null, finalPath);
      },
    }),
  }).single('image'),
  (req, res, next) => {
    let host = req.get("host");
    console.log(" Req. body", req.body);
    console.log(" File information:", req.file)

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
