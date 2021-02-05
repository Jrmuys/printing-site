const express = require("express");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const userController = require("../controller/user.controller");
const User = require("../models/user.model");
const Model = require("../models/model.model");
const router = express.Router();

async function createModel(req, res, next) { }

const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const config = require('../config/config');

AWS.config.update({
  accessKeyId: config.s3AccessKeyID,
  secretAccessKey: config.s3SecretAcessKey,
  signatureVersion: 'v4',
});

const S3 = new AWS.S3();

const isAllowedMimetype = (mime) =>
  ['application/octet-stream'].includes(mime.toString());

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
  return `${name}.${ext}.stl`;
};

const handleModelUploadMiddleware = multer({
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
      file.path = finalPath;

      cb(null, finalPath);
    },
  }),
});


router.post(
  "",
  handleModelUploadMiddleware.single("model"),
  async (req, res, next) => {
    console.log("Recieved Model Request");
    const url = req.protocol + "://" + req.get("host");

    const email = req.body.user;
    var user;
    // console.log(email);
    if (email != "null") {
      // console.log("finding user with email: " + email);
      try {
        user = await User.findOne({ email });
      } catch {
        console.log("user not found");
        user = null;
      }
    } else {
      user = null;
    }
    const model = new Model({
      user: user,
      title: req.body.title,
      filePath: req.file.location,
      units: req.body.units,
      comment: req.body.comment,
      quantity: req.body.quantity,
    });
    console.log("MODEL: ", model);
    model.save().then((createdModel) => {
      console.log("model saved to db", req.file);
      console.log("Created model: ", createdModel);
      res.status(201).json(createdModel);
    });
  }
);

router.put(
  "/:id",
  handleModelUploadMiddleware.single("model"),
  async (req, res, next) => {
    console.log("Recieved Model Update Request");
    let filePath = req.body.filePath;
    const user = req.body.user;
    const model = new Model();
    Model.updateOne(
      { _id: req.params.id },
      {
        user: req.body.user,
        title: req.body.title,
        filePath: req.file.location,
        units: req.body.units,
        comment: req.body.comment,
        quantity: req.body.quantity,
      }
    )
      .then((updatedModel) => {
        console.log("model updated in db", req.file);
        console.log("Updated model: ", updatedModel);
        res.status(200).json(updatedModel);
      })
      .catch((err) => {
        res.status(500).json({
          message: "An error in updating the model occurred",
          error: err,
        });
      });
  }
);

router.get("/:id", (req, res, next) => {
  Model.findById(req.params.id)
    .then((model) => {
      if (model) {
        console.log("Model found!");
        res.status(200).json(model);
      } else {
        console.log("model not found");
        res.status(404).json({ message: "Model not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error in finding the model occurred",
        error: err,
      });
    });
});

module.exports = router;
