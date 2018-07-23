// published modules
const uuidv1 = require('uuid/v1')

// custom modules
const fulfiller = require('../fulfiller/index')

// aws utilities
const ply = require('../utilities/polly')
const lex = require('../utilities/lexRuntime')

// router object
const router = require('express').Router()

// add intents to this list to increase guest permissions
const guestPermissions = ['AddUser','Joke','RonSwansonQuote',
  'ISSLocation','RandomNumberFact','LoveCalculator','TodaysDate',
  'Recipe','CheckWeather','Dictionary','Stop']

// authenticate users and route accordingly
router.use((req, res, next) => {
  console.log('authenticate conversation')
  if (req.session.aid) {
    // is user
    user(req, res, next)
  } else if (req.session.guestaid) {
    // is guest
    guest(req, res, next)
  } else {
    // generate guest id and proceed as guest
    req.session.guestaid = uuidv1()
    guest(req, res, next)
  }
})

// chat with lex with user permissions
function user (req, res, next) {
  if (!req.session.extendedMessage) {
    // proceed as usual
    lexChat(req, res, next)
  } else {
    // fulfill request with extended message --> ex) the body of an email
    req.session.msg = req.body.text
    fulfiller.fulfill(req, res, next)
  }
}

async function guest (req, res, next) {
  // grab conversation information
  id = req.session.guestaid
  text = req.body.text

  // make lex request
  lexRes = await lex.postContent(id, text)

  // execute this block if the user has permission to do so
  if (guestPermissions.includes(lexRes.intentName)) {
    // return meta data if CreateUser intent is finished gathering information
    if (lexRes.intentName === 'AddUser' && lexRes.dialogState === 'Fulfilled') {
      response = 'Please send me an image to complete the registration process. You will need to send the image after signup is complete to login'
      stream = await ply.talk(response)
      res.send({audio: stream, text: response, meta: lexRes.slots})
    } else {
      send(req, res, next, lexRes.message)
    }
  } else {
    // return a message that ellicits the users login or account creation
    response = "It appears that you do not have permission to make that request. Please login or create an account to access. To login, please snap and then send a photo. To create an account type 'signup'"
    send(req, res, next, response)
  }
}

// send text to chatbot and fulfill request when necessary
async function lexChat (req, res, next) {
  // extract user info from session
  id = req.session.id
  text = req.body.text
  meta = req.session.meta

  // send text to lex chatbot
  lexRes = await lex.postContent(id, text)
  // check if entries are ready for fulfillment
  if (lexRes.dialogState === 'ReadyForFulfillment') {
    // fulfill request
    req.session.intent = lexRes.intentName
    req.session.slots = lexRes.slots
    fulfiller.fulfill(req, res, next)
  } else {
    // send lex's response back to user
    send(req, res, next, lexRes.message)
  }
}

async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  router: router
}
