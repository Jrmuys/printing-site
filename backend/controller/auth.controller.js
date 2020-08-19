const jwt = require("jsonwebtoken");
const config = require("../config/config");

function generateToken(user) {
  const payload = user;
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
  // return jwt.sign(JSON.stringify(payload), config.jwtSecret);
}
// { expireIn: "1h" }
module.exports = { generateToken };
