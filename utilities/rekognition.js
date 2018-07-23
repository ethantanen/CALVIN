/*
 * createCollection, deleteCollection, indexFaces, listCollections,
 * searchFaces, searchFacesByImage
 */

// Published modules
const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

// Create Rekognition Service Object
let rk = new AWS.Rekognition({
  apiVersion: '2016-06-27'
})

// Create Collection
function createCollection (collection) {
  let params = {
    CollectionId: collection
  }
  return new Promise((resolve, reject) => {
    rk.createCollection(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Collection
function deleteCollection (collection) {
  let params = {
    CollectionId: collection
  }
  return new Promise((resolve, reject) => {
    rk.deleteCollection(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Index Faces
function indexFaces (collection, bucket, image) {
  let params = {
    CollectionId: collection,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: image
      }
    },
    DetectionAttributes: [
      'ALL'
    ]
  }
  return new Promise((resolve, reject) => {
    rk.indexFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Index Base64 Encoded Image
function indexFaces64 (collection, buffer) {
  let params = {
    CollectionId: collection,
    Image: {
      Bytes: buffer
    },
    DetectionAttributes: [
      'ALL'
    ]
  }
  return new Promise((resolve, reject) => {
    rk.indexFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Collection
function listCollections () {
  return new Promise((resolve, reject) => {
    rk.listCollections({}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Search Faces
function searchFaces (collection, faceId) {
  let params = {
    CollectionId: collection,
    FaceId: faceId
  }
  return new Promise((resolve, reject) => {
    rk.searchFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Search Faces By Image
function searchFacesByImage (collection, bucket, image) {
  let params = {
    CollectionId: collection,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: image
      }
    }
  }
  return new Promise((resolve, reject) => {
    rk.searchFacesByImage(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Search Faces By Base63 Encoded Image
function searchFacesByImage64 (collection, buffer) {
  let params = {
    CollectionId: collection,
    Image: {
      Bytes: buffer
    }
  }
  return new Promise((resolve, reject) => {
    rk.searchFacesByImage(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Faces
function deleteFaces (collection, id) {
  let params = {
    CollectionId: collection,
    FaceIds: [
      id
    ]
  }
  return new Promise((resolve, reject) => {
    rk.deleteFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Detect Faces (emotions, features, etc)
function detectFaces (bucket, image) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: image
      }
    },
    Attributes: [
      'ALL'
    ]
  }
  return new Promise((resolve, reject) => {
    rk.detectFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Detect Faces (emotions, features, etc)
function detectFaces64 (buffer) {
  let params = {
    Image: {
      Bytes: buffer
    },
    Attributes: [
      'ALL'
    ]
  }
  return new Promise((resolve, reject) => {
    rk.detectFaces(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Expose functions
module.exports = {
  createCollection: createCollection,
  deleteCollection: deleteCollection,
  indexFaces: indexFaces,
  indexFaces64: indexFaces64,
  listCollections: listCollections,
  searchFaces: searchFaces,
  searchFacesByImage: searchFacesByImage,
  searchFacesByImage64: searchFacesByImage64,
  deleteFaces: deleteFaces,
  detectFaces64: detectFaces64
}
