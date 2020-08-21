const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, config.jwtSecret);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth failed!",
    });
  }
};
