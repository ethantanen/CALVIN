/*
 * This controller provides the functionality to add a user to
 * Calvin's system.
 */

// aws utilities
const rk = require('../utilities/rekognition')
const ply = require('../utilities/polly')

// models
const userTable = require('../models/users')

// router object
const router = require('express').Router()

// table and collection name
const NAME = process.env.NAME

// check if user is already in the system
router.use(async (req, res, next) => {
  // check if face is already in collection
  image = new Buffer(req.body.image.split(',')[1], 'base64')
  check = await rk.searchFacesByImage64(NAME, image)

  // respond with an error message if the user is already in the system
  if (check.FaceMatches.length > 0) {
    text = 'It appears that you are already in the system. Please login to continue.'
    stream = await ply.talk(text)
    res.send({audio: stream, text: text})
  } else {
    next()
  }
})

// index face and add meta data to dynamodb table
router.post('/', async (req, res) => {
  console.log('adding user to calvin\'s system...')

  try {
    // retrieve the users meta data and profile picture from request object
    meta = req.body.meta
    image = new Buffer(req.body.image.split(',')[1], 'base64')

    // add user to database
    user = await addUser64(NAME, image)

    // respond with a confirmation
    text = user.FIRST_NAME + ' added to the system.'
    stream = await ply.talk(text)
    res.send({audio: stream, text: text})
    console.log('user successfully added to calvin\'s system...')
  } catch (err) {
    // log the error and return an error message
    console.log(err)
    text = 'I was unable to add you to the system.'
    stream = await ply.talk(text)
    res.send({audio: stream, text: text})
  }
})

/*
 * This function adds a user to the system, which entails
 * adding the user to the face collection and dynamo database.
 * The meta parameter contains information to store on the user
 * such as job title.
 */
async function addUser64 (collection, buffer) {
  // add faceprint to face collection
  let face = await rk.indexFaces64(collection, buffer)
    .catch((err) => {
      console.log(err)
      throw new Error('no face in image')
    })

    // concatenate the face id with the metadata
  let id = face.FaceRecords[0].Face.FaceId
  let userData = {...{USER_ID: id}, ...meta}

  await userTable.addUser(userData)
    .catch((err) => {
      console.log(err)
      // delete face index if the user couldn't be added
      rk.deleteFaces(NAME, id)
      throw new Error('couldnt add user to database')
    })

  return userData
}

module.exports = {
  router: router
}
