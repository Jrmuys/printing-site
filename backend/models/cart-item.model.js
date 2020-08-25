const mongoose = require("mongoose");
const Model = require("../models/model.model");

function CartItem(
  model,
  price,
  imgUrl,
  itemTotal,
  printStatus,
  boundingVolume
) {
  this.model = model;
  this.price = price;
  this.imgUrl = imgUrl;
  this.itemTotal = itemTotal;
  this.printStatus = printStatus | "NA";
  this.boundingVolume = boundingVolume;
}

module.exports = CartItem;
