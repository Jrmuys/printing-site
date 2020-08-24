const mongoose = require("mongoose");

function CartItem(
  modelId,
  price,
  title,
  imgUrl,
  quantity,
  itemTotal,
  modelPath,
  printStatus
) {
  this.modelId = modelId;
  this.price = price;
  this.title = title;
  this.imgUrl = imgUrl;
  this.quantity = quantity;
  this.itemTotal = itemTotal;
  this.modelPath = modelPath;
  this.printStatus = printStatus | "NA";
}

module.exports = CartItem;
