const express = require("express");
const asyncHandler = require("express-async-handler");
const multer = require("multer");

const Model = require("../models/model.model");
const router = require("./auth.route");

// const MIME_TYPE_MAP = {
//   ""
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/modelFiles");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    console.log("mimetype: ", file.mimetype);
    cb(null, name + "-" + Date.now() + ".stl");
  },
});

router.post(
  "",
  multer({ storage: storage }).single("model"),
  (req, res, next) => {
    console.log("Recieved Model Request");
    const url = req.protocol + "://" + req.get("host");
    const model = new Model({
      user: null,
      title: req.body.title,
      filePath: url + "/api/modelFiles/" + req.file.filename,
      units: req.body.units,
    });
    model.save().then((createdModel) => {
      console.log("model saved to db", req.file);
      console.log("Created model: ", createdModel);
      res.status(201).json(createdModel);
    });
  }
);

module.exports = router;
