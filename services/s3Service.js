const AWS = require("aws-sdk");
const { logger } = require("./logService");
require("dotenv").config();

const s3 = new AWS.S3({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadToS3 = async (Key, Body) => {
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Body,
        Bucket: `${process.env.S3_BUCKET}/profile`,
        Key,
      },
      (err, data) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(data.Location); // Resolve with the S3 object location if successful
        }
      }
    );
  });
};

const readFromS3 = async (Key) => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: `${process.env.S3_BUCKET}/profile`,
        Key,
      },
      (err, data) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(data.Body); // Resolve with the S3 object location if successful
        }
      }
    );
  });
};

const readFromS3Service = async (Key) => {
  try {
    const result = await readFromS3(Key);
    return result;
  } catch (e) {
    logger.error(e.message);
    return "";
  }
};
module.exports = {
  uploadToS3,
  readFromS3Service,
};
