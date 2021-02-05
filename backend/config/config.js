require("dotenv").config();
const envVars = process.env;

module.exports = {
  port: process.env.PORT | 8080,
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
  s3AccessKeyID: envVars.S3_ACCESS_ID,
  s3SecretAcessKey: envVars.S3_SECRET_ACCESS_SECRET,
  s3BucketName: envVars.S3_BUCKET_NAME,
  awsRegion: envVars.AWS_REGION,
};
