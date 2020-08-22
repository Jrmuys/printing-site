"use strict";

const config = require("../config/config");

/**
 *
 * PayPal Node JS SDK dependency
 */
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment() {
  let clientId =
    "ASo29H6AXV4zhdJiJBNDjxp1VXECNJF2CFApAIloYin79pP9HjbHH85AS1adEcLy9hrEtEf4Qu5sORkL";
  let clientSecret =
    "EL5XABCDXaTaDKHW_kk3sFq0EZw1bU4uWpRMrHfRQACQPPfE-uZdrWIs5CQKjosLgBmySEaFG2eZVIgv";

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

async function prettyPrint(jsonData, pre = "") {
  let pretty = "";
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  for (let key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      if (isNaN(key)) pretty += pre + capitalize(key) + ": ";
      else pretty += pre + (parseInt(key) + 1) + ": ";
      if (typeof jsonData[key] === "object") {
        pretty += "\n";
        pretty += await prettyPrint(jsonData[key], pre + "    ");
      } else {
        pretty += jsonData[key] + "\n";
      }
    }
  }
  return pretty;
}

module.exports = { client: client, prettyPrint: prettyPrint };
