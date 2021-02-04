const AWS = require('aws-sdk');
const config = require('../config/config')

ID = config.s3AccessKeyID;
SECRET = config.secretAccessKey;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});