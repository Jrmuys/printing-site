const mongoose = require("mongoose");
const express = require("express");

const Cart = require("../models/cart.model");
const CartItem = require("../models/cart-item.model");

function createCart(_id) {
  cart = new Cart({
    userId: _id,
    totalPrice: 0,
  });
  cart.save().then(() => {
    console.log("Cart generated for user with id " + _id);
  });
}

function addToCart(req, res, next, host) {
  const url = req.protocol + "://" + host;
  const cartItem = new CartItem(
    req.body.modelId,
    parseFloat(req.body.price),
    req.body.title,
    url + "/api/images/" + req.file.filename,
    parseFloat(req.body.quantity),
    parseFloat(req.body.itemTotal),
    req.body.modelPath
  );
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $push: { cartItems: cartItem },
    },
    { new: true }
  ).then((newCart) => {
    newCart.totalPrice
      ? (newCart.totalPrice =
          parseFloat(newCart.totalPrice) + parseFloat(cartItem.itemTotal))
      : (newCart.totalPrice = cartItem.itemTotal);
    cart = newCart.save().then((savedCart) => {
      savedCart
        ? res.status(201).json({ message: "added successfully" })
        : res.status(404).json({ message: "Cart not found" });
    });
  });
}

// function removeFromCart(_id, cartItem) {
//   updatedCart = new Cart({
//     userId: _id,
//     cartItems: cartItems,
//   });
//   return Cart.findOneAndUpdate(
//     { userId: _id },
//     { $pop: { cartItems: cartItem } }
//   );
// }

// async function getCart(_id) {
//   Cart.findOne({ userId: _id }).then((cart) => {
//     if (cart) {
//       console.log("Got cart:", cart);
//       return cart;
//     } else {
//       console.log("Didn't cart:", cart);

//       return null;
//     }
//   });
// }

function getCart(req, res, next) {
  Cart.findOne({ userId: req.user._id }).then((cart) => {
    if (cart) {
      console.log("Got cart:", cart);
      res.status(201).json(cart);
    } else {
      console.log("Didn't cart:", cart);
      res.status(404).json({ message: "Cart Items not found" });
    }
  });
}

function updateCart(req, res, next) {
  let newTotalPrice = 0;
  cartItems = req.body;
  cartItems.map((cartItem) => {
    newTotalPrice += cartItem.price * cartItem.quantity;
  });
  console.log("New total price: ", newTotalPrice);
  updatedCart = new Cart({
    cartItems: cartItems,
    totalPrice: newTotalPrice,
  });
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    { cartItems: cartItems, totalPrice: newTotalPrice }
  ).then((cart) =>
    cart
      ? res.status(201).json({ message: "Updated cart..." })
      : res.status(404).json({ message: "could not update cart" })
  );
}

function clear(req, res, next) {
  updatedCart = new Cart({
    userId: req.user._id,
    cartItems: [],
  });
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    { cartItems: [], totalPrice: 0 }
  ).then(() => {
    res.status(201).json({ message: "Cart cleared successfully!" });
  });
}

function deleteItem(req, res, next) {
  updatedCart = Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { cartItems: req.body } },
    { new: true }
  ).then((cart) => {
    console.log(cart.totalPrice, req.body.itemTotal);
    cart.totalPrice -= req.body.itemTotal;
    cart.save().then(() => {
      res.status(201).json({ message: "Item successfully deleted" });
    });
  });
}

module.exports = {
  createCart,
  addToCart,
  getCart,
  updateCart,
  clear,
  deleteItem,
};