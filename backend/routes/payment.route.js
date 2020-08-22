const express = require("express");
const config = require("../config/config");
const http = require("http");
const https = require("https");
const router = express.Router();

// Note: This is example code. Each server platform and programming language has a different way of handling requests, making HTTP API calls, and serving responses to the browser.

// 1. Set up your server to make calls to PayPal

// 1a. Add your client ID and secret
PAYPAL_CLIENT = config.paypalClient;
PAYPAL_SECRET = config.paypalSecret;

// 1b. Point your server to the PayPal API
PAYPAL_OAUTH_API = "https://api.sandbox.paypal.com/v1/oauth2/token/";
PAYPAL_ORDER_API = "https://api.sandbox.paypal.com/v2/checkout/orders/";

// 1c. Get an access token from the PayPal API
basicAuth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
auth = https.request(PAYPAL_OAUTH_API, {
  headers: {
    Accept: `application/json`,
    Authorization: `Basic ${basicAuth}`,
  },
  method: "POST",
  data: `grant_type=client_credentials`,
});

// 2. Set up your server to receive a call from the client
router.post(""),
  (req, res, next) => {
    // 2a. Get the order ID from the request body
    orderID = req.body.orderID;
    console.log(orderID);
    // 3. Call PayPal to get the transaction details
    details = http.get(PAYPAL_ORDER_API + orderID, {
      headers: {
        Accept: `application/json`,
        Authorization: `Bearer ${auth.access_token}`,
      },
    });

    // 4. Handle any errors from the call
    if (details.error) {
      return res.send(500);
    }

    // 5. Validate the transaction details are as expected
    if (details.purchase_units[0].amount.value !== "5.77") {
      return res.send(400);
    }

    // 6. Save the transaction in your database
    // database.saveTransaction(orderID);

    // 7. Return a successful response to the client
    return res.send(200);
  };

module.exports = router;
