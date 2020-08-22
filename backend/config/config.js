require("dotenv").config();
const envVars = process.env;

module.exports = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  mongo: {
    uri: envVars.MONGODB_URI,
    port: envVars.MONGO_PORT,
    isDebug: envVars.MONGOOSE_DEBUG,
  },
  jwtSecret: envVars.JWT_SECRET,
  expiresIn: envVars.EXPIRES_IN,
  paypalSecret: envVars.PAYPAL_SECRET,
  paypalClient: envVars.PAYPAL_CLIENT,
};
