const mongoose = require("mongoose");

function CartItem(
  modelId,
  price,
  title,
  imgUrl,
  quantity,
  itemTotal,
  modelPath
) {
  this.modelId = modelId;
  this.price = price;
  this.title = title;
  this.imgUrl = imgUrl;
  this.quantity = quantity;
  this.itemTotal = itemTotal;
  this.modelPath = modelPath;
}

module.exports = CartItem;
