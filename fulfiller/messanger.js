const ply = require('../utilities/polly')
const apis = require('../apis/index')

// calvin sends an email
async function sendSlackMessage (req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    json = await apis.sendSlackMessage(req.session.slots.CHANNEL, req.session.msg)
    send(req, res, next, 'I have sent your message.')
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the message say?')
  }
}

// send an email using outlook woo!
async function sendOutlookEmail (req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    json = await apis.sendEmail(req.session.meta.FIRST_NAME + ' ' + req.session.meta.LAST_NAME, req.session.slots.RECIPIENT, req.session.msg)
    send(req, res, next, 'I have sent your email.')
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the message say?')
  }
}

async function sendSMS (req, res, next) {
  if (req.session.extendedMessage) {
    req.session.extendedMessage = false
    json = await apis.sendSMS(req.session.slots.PHONENUM, req.session.msg)
    send(req, res, next, json.text)
  } else {
    req.session.extendedMessage = true
    send(req, res, next, 'What should the message say?')
  }
}

// generate audio response and send to client
async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  sendSlackMessage: sendSlackMessage,
  sendOutlookEmail: sendOutlookEmail,
  sendSMS: sendSMS
}
