// published modules
const uuidv1 = require('uuid/v1')

// custom modules
const fulfiller = require('../fulfiller/index')

// aws utilities
const ply = require('../utilities/polly')
const lex = require('../utilities/lexRuntime')

// router object
const router = require('express').Router()

// add intents to this prevent guest usage
const guestRestrictions = ['GetTimeToDest', 'FileShare', 'SendSlack', 'SendEmail',
      'SendSMS','FindJobTitle','DownloadRepo','FindEmail','FindJobTitle','LogOff']

// authenticate users and route accordingly
router.use((req, res, next) => {
  console.log('authenticate conversation', req.session.guestaid)
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

// send text to chatbot and fulfill request when necessary
async function lexChat (req, res, next) {
  // extract user info from session
  let id = req.session.id
  let text = req.body.text
  let meta = req.session.meta

  // send text to lex chatbot
  let lexRes = await lex.postContent(id, text)

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

// chat with lex with guest permissions
async function guest (req, res, next) {
  // grab conversation information
  let id = req.session.guestaid
  let text = req.body.text

  // make lex request
  let lexRes = await lex.postContent(id, text)

  // execute this block if the user has permission to do so
  if (!guestRestrictions.includes(lexRes.intentName)) {

    // return meta data if CreateUser intent is finished gathering information
    if (lexRes.intentName === 'AddUser' && lexRes.dialogState === 'ReadyForFulfillment' ) {
      // prompt user to send in an image to complete registration process
      let response = 'Please send me an image to complete the registration process. You will need to send the image after signup is complete to login'
      let stream = await ply.talk(response)
      res.send({audio: stream, text: response, meta: lexRes.slots})
    } else {
      // check if intent is ready for fulfillment else send lex response back to user
      if (lexRes.dialogState === 'ReadyForFulfillment') {
        // populate session with necessary information and send to fulfiller
        req.session.intent = lexRes.intentName
        req.session.slots = lexRes.slots
        fulfiller.fulfill(req, res, next)
      } else {
        // send lex response back to client
        console.log(lexRes)
        send(req, res, next, lexRes.message)
      }
    }
  } else {
    // return a message that ellicits the users login or account creation
    let response = "It appears that you do not have permission to make that request. Please login or create an account to access. To login, please snap and then send a photo. To create an account type 'signup'"
    send(req, res, next, response)
  }
}

// create audio stream from text and send to client
async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  router: router
}
