// 1. Set up your server to make calls to PayPal
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const CartItem = require("../models/cart-item.model");

// 1a. Import the SDK package
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// 1b. Import the PayPal SDK client that was created in `Set up Server-Side SDK`.
/**
 *
 * PayPal HTTP client dependency
 */
const payPalClient = require("./payPalClient");

// 2. Set up your server to receive a call from the client
async function handleRequest(req, res) {
  // 2a. Get the order ID from the request body
  const orderID = req.body.orderID;

  // 3. Call PayPal to get the transaction details
  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {
    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  cart = await Cart.findOne({ userId: req.body.userID }).catch((err) => {
    res
      .status(500)
      .json({ message: "An error in finding the cart occurred", error: err });
  });
  if (cart) {
    // 5. Validate the transaction details are as expected
    // console.log(
    //   `Comparing prices of request: ${order.result.purchase_units[0].amount.value} with cart: ${cart.totalPrice}`
    // );
    // if (order.result.purchase_units[0].amount.value !== cart.totalPrice) {
    //   return res.send(400);
    // }
    console.log(order.result.purchase_units.shipping);
    let orderArray = new Array();
    for (var i = 0; i < cart.cartItems.length; i++) {
      cart.cartItems[i].printStatus = "NOT STARTED";
      orderArray.push(cart.cartItems[i]);
    }

    order = new Order({
      userId: req.body.userID,
      orderId: req.body.orderID,
      date: Date.parse(order.result.create_time),
      paymentDetails: {
        totalPrice: order.result.purchase_units[0].amount.value,
        paymentStatus: order.result.status,
        tax: req.body.tax,
        shipping: req.body.shipping,
      },
      orderStatus: "RECIEVED",
      customerName: req.body.userName,
      customerEmail: req.body.userEmail,
      shipping: order.result.purchase_units[0].shipping,
    });
    await order.save().catch((err) => {
      res
        .status(500)
        .json({ message: "An error in saving the order occurred", error: err });
    });
    await Order.findOneAndUpdate(
      { orderId: req.body.orderID },
      { orderItems: orderArray }
    ).catch((err) => {
      res.status(500).json({
        message: "An error in updating the order occurred",
        error: err,
      });
    });
  } else {
    return res.send(400);
  }

  // 6. Save the transaction in your database
  // await database.saveTransaction(orderID);

  // 7. Return a successful response to the client
  return res.send(200);
}

module.exports = { handleRequest: handleRequest };
