const mongoose = require("mongoose");
const express = require("express");

const Cart = require("../models/cart.model");
const CartItem = require("../models/cart-item.model");

function createCart(_id) {
  console.log("Creating cart");
  cart = new Cart({
    userId: _id,
    totalPrice: 0,
  });
  cart.save().catch((err) => {
    res
      .status(500)
      .json({ message: "An error in saving the cart occurred", error: err });
  });
}

function addToCart(req, res, next, host) {
  console.log("adding to cart...");
  const url = req.protocol + "://" + host;
  const cartItem = new CartItem(
    JSON.parse(req.body.model),
    parseFloat(req.body.price),
    req.file.location,
    parseFloat(req.body.itemTotal),
    req.body.printStatus,
    req.body.boundingVolume
  );
  console.log("Cart item,", cartItem);
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $push: { cartItems: cartItem },
    },
    { new: true }
  )
    .then((newCart) => {
      // cart;
      console.log(newCart);
      newCart.totalPrice
        ? (newCart.totalPrice =
          parseFloat(newCart.totalPrice) + parseFloat(cartItem.itemTotal))
        : (newCart.totalPrice = cartItem.itemTotal);
      let cart = newCart.save().then((savedCart) => {
        savedCart
          ? res.status(201).json({ message: "added successfully" })
          : res.status(404).json({ message: "Cart not found" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "An error in adding to the cart occurred",
        error: err,
      });
    });
}

function getCart(req, res, next) {
  Cart.findOne({ userId: req.user._id })
    .then((cart) => {
      if (cart) {
        res.status(201).json(cart);
      } else {
        res.status(404).json({ message: "Cart Items not found" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "An error in getting the cart occurred", error: err });
    });
}

function updateCart(req, res, next) {
  let newTotalPrice = 0;
  cartItems = req.body;
  cartItems.map((cartItem) => {
    newTotalPrice += +cartItem.price * +cartItem.model.quantity;
  });
  updatedCart = new Cart({
    cartItems: cartItems,
    totalPrice: newTotalPrice,
  });
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    { cartItems: cartItems, totalPrice: newTotalPrice }
  )
    .then((cart) =>
      cart
        ? res.status(201).json({ message: "Updated cart..." })
        : res.status(404).json({ message: "could not update cart" })
    )
    .catch((err) => {
      res.status(500).json({
        message: "An error in updating the cart occurred",
        error: err,
      });
    });
}

function clear(req, res, next) {
  updatedCart = new Cart({
    userId: req.user._id,
    cartItems: [],
  });
  Cart.findOneAndUpdate(
    { userId: req.user._id },
    { cartItems: [], totalPrice: 0 }
  )
    .then(() => {
      res.status(201).json({ message: "Cart cleared successfully!" });
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error in clearing the cart occurred",
        error: err,
      });
    });
}

function deleteItem(req, res, next) {
  updatedCart = Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { cartItems: req.body } },
    { new: true }
  ).then((cart) => {
    cart.totalPrice -= req.body.itemTotal;
    cart
      .save()
      .then(() => {
        res.status(201).json({ message: "Item successfully deleted" });
      })
      .catch((err) => {
        res.status(500).json({
          message: "An error in deleting the cart item occurred",
          error: err,
        });
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
