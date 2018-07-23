/*
createBucket, deleteBucket, listBucket, putObject,
getObject, deleteObject, listObjects
*/

// Published modules
const AWS = require('aws-sdk')
const fs = require('fs')

AWS.config.update({
  region: 'us-east-1'
})

// Create S3 Service Object
let s3 = new AWS.S3({
  apiVersion: '2012-10-17'
})

// Create Bucket
function createBucket (bucket) {
  let params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.createBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Bucket
function deleteBucket (bucket) {
  let params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.deleteBucket(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Bucket
function listBuckets () {
  return new Promise((resolve, reject) => {
    s3.listBuckets({}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Put Object
function putObject (bucket, body, key) {
  let params = {
    Body: body,
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Put Object
function putObject64 (bucket, buffer, key) {
  let params = {
    Body: buffer,
    Bucket: bucket,
    Key: key,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  }
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get Object
function getObject (bucket, key) {
  let params = {
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Object
function deleteObject (bucket, key) {
  let params = {
    Bucket: bucket,
    Key: key
  }
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Objects
function listObjects (bucket) {
  let params = {
    Bucket: bucket
  }
  return new Promise((resolve, reject) => {
    s3.listObjects(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

module.exports = {
  createBucket: createBucket,
  deleteBucket: deleteBucket,
  listBuckets: listBuckets,
  putObject: putObject,
  putObject64: putObject64,
  getObject: getObject,
  deleteObject: deleteObject,
  listObjects: listObjects
}
