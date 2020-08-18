const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, require: true },
  units: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  comment: { type: String },
  quantity: { type: String, required: true },
});

module.exports = mongoose.model("Model", modelSchema);
