// const { fileSizes } = require('../config/keys');
require('dotenv').config();
const httpStatus = require('http-status');
const otherHelper = require('./others.helper');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const maxFileSize = process.env.maxFileSize || 1000000000;
const uploaderHelper = {};

const s3 = new aws.S3({
 accessKeyId: 'AKIAI4IYUCNFNIWHMB4Q',
 secretAccessKey: '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',
 Bucket: 'onclick'
});

let mimeType = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/svg': 'svg',
  'image/svg+xml': 'svg+xml',
  'image/gif': 'gif',
 'image/webp':'webp',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
   'text/csv': 'csv',
  'application/pdf':'pdf',
  'application/msword': 'doc'
};
uploaderHelper.uploadFiles = (destinationPath, uploadType, fieldData) => {
  const temp = maxFileSize / (1024 * 1024);
  var localstorage = multer.diskStorage({
    destination: destinationPath,
    filename: async (req, file, cb) => {
      const randomString = await otherHelper.generateRandomHexString(15);
      cb(null, randomString + '-' + file.originalname);
    },
  });

  var multerStorage = multerS3({
    s3:s3,
    bucket: 'onclick',
    acl: 'public-read',
      key:async (req, file, cb) => {
      const randomString = await otherHelper.generateRandomHexString(15);
      cb(null, randomString + '-' + file.originalname);
    },
  });

  const uploader = multer({
    storage: process.env.STORAGE_TYPE === 's3_bucket'  ? multerStorage : localstorage,
    fileFilter: function (req, file, callback) {
      const isValid = !!mimeType[file.mimetype]; //check if the valid mime type is submitted
      let error = isValid ? null : new Error('Only images and video files  allowed!');
      callback(error, isValid);
    },
    limits: { fileSize: maxFileSize },
  });

  if (uploadType === 'array') {
    var upload = uploader.array(fieldData[0], fieldData[1]);
  } else if (uploadType === 'fields') {
    var upload = uploader.fields(fieldData);
  } else if (uploadType === 'single') {
    var upload = uploader.single(fieldData);
  } else if (uploadType === 'any') {
    var upload = uploader.any(fieldData);
  }

  return (fileUpload = (req, res, next) => {
    upload(req, res, function (error) {
      if (error) {
        //instanceof multer.MulterError
        if (error.code == 'LIMIT_FILE_SIZE') {
          return otherHelper.sendResponse(res, httpStatus.NOT_ACCEPTABLE, false, error, null, `FileSize must be greater than ${temp}MB`, null);
        } else {
          return otherHelper.sendResponse(res, httpStatus.NOT_ACCEPTABLE, false, error, null, `${error}`, null);
        }
      } else {
        next();
      }
    });
  });
};

module.exports = uploaderHelper;
