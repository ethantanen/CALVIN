// aws utilities
const rk = require('../utilities/rekognition')
const ply = require('../utilities/polly')
const userTable = require('../models/users')

// router object
const router = require('express').Router()

// bucket, table, collection name
const NAME = process.env.NAME

/**
 * Authenticate that the user is not already
 * logged in.
 */
router.use(async (req, res, next) => {
  if (req.session.aid) {
    text = 'It appears that you are already logged in. Please log off if you don\'t believe this to be the case'
    stream = await ply.talk(text)
    res.send({audio: stream, text: text})
  } else {
    next()
  }
})

/**
 * Endpoint for authenticating users by checking if there
 * face is in the user collection.
 */
router.post('/', async (req, res) => {
  console.log('authenticating user...')

  // get base-64 encoded image from request
  buffer = new Buffer(req.body.image.split(',')[1], 'base64')

  // determine if image is of a user
  result = await isUser64(NAME, buffer)

  if (result.isUser) {
    // remove guest id if user was interacting as guest
    req.session.guestaid = undefined

    // get user meta data for session creation
    id = result.id
    meta = await userTable.getUserClean(id)

    console.log(meta, id)
    // populate users session
    req.session.aid = id
    req.session.meta = meta
    req.session.face = result.face

    // greet the user
    name = meta.FIRST_NAME
    text = name + ' welcome back!'
    stream = await ply.talk(text)

    res.send({audio: stream, text: text})
  } else {
    // inform client that they are not in the system
    text = 'You are not a user. Please sign up if you would like to continue our conversation.'
    stream = await ply.talk(text)
    res.send({audio: stream, text: text})
  }
})

// Determines if the base64 encoded image is of a user
function isUser64 (collection, buffer) {
  // get facial features and determine if image is of user
  var features = detectFacialFeatures64(buffer)
  var recognize = determineIsUserByImage64(collection, buffer)

  // wait for functions to complete, concatenate objects and return
  return Promise.all([features, recognize])
    .then((data) => {
      return {...data[0], ...data[1]}
    })
    .catch((err) => {
      return {error: 'no face in image'}
    })
}

// Determine the facial features of the user in the image
async function detectFacialFeatures64 (buffer) {
  var features = await rk.detectFaces64(buffer)
  return {face: features}
}

// Determine if the image contains a user
async function determineIsUserByImage64 (collection, buffer) {
  // search face collection using base64 encoded image
  var res = await rk.searchFacesByImage64(collection, buffer)

  // if face-match list is nonempty the image is of a user
  if (res.FaceMatches.length > 0) {
    console.log('image is of user...')
    var id = res.FaceMatches[0].Face.FaceId
    return {isUser: true, id: id}
  } else {
    console.log('image is not of user...')
    return {isUser: false, id: null}
  }
}

module.exports = {
  router: router
}
