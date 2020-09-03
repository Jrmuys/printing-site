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
  this.price = price | 0;
  this.imgUrl = imgUrl;
  this.itemTotal = itemTotal | 0;
  this.printStatus = printStatus | "NA";
  this.boundingVolume = boundingVolume;
}

module.exports = CartItem;
