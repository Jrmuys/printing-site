const express = require("express");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const userController = require("../controller/user.controller");
const User = require("../models/user.model");
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

async function createModel(req, res, next) {}

router.post(
  "",
  multer({ storage: storage }).single("model"),
  async (req, res, next) => {
    console.log("Recieved Model Request");
    const url = req.protocol + "://" + req.get("host");

    const email = req.body.user;
    var user;
    console.log(email);
    if (email != "null") {
      console.log("finding user with email: " + email);
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
      filePath: url + "/api/modelFiles/" + req.file.filename,
      units: req.body.units,
      comment: req.body.comment,
      quantity: req.body.quantity,
    });
    model.save().then((createdModel) => {
      console.log("model saved to db", req.file);
      console.log("Created model: ", createdModel);
      res.status(201).json(createdModel);
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("model"),
  async (req, res, next) => {
    console.log("Recieved Model Update Request");
    let filePath = req.body.filePath;

    const user = req.body.user;
    // console.log(email);
    // if (email != "null") {
    //   console.log("finding user with email: " + email);
    //   try {
    //     user = await User.findOne({ email });
    //   } catch {
    //     console.log("user not found");
    //     user = null;
    //   }
    // } else {
    //   user = null;
    // }
    const model = new Model();
    Model.updateOne(
      { _id: req.params.id },
      {
        user: req.body.user,
        title: req.body.title,
        filePath: req.body.modelPath,
        units: req.body.units,
        comment: req.body.comment,
        quantity: req.body.quantity,
      }
    ).then((updatedModel) => {
      console.log("model updated in db", req.file);
      console.log("Updated model: ", updatedModel);
      res.status(200).json(updatedModel);
    });
  }
);

router.get("/:id", (req, res, next) => {
  Model.findById(req.params.id).then((model) => {
    if (model) {
      console.log("Model found!");
      res.status(200).json(model);
    } else {
      console.log("model not found");
      res.status(404).json({ message: "Model not found!" });
    }
  });
});

module.exports = router;
