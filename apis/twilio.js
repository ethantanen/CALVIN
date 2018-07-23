var twilio = require('twilio')

const TWILIO_ACCOUNT_SID = process.env.TWILIO_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_TOKEN
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

function sendSMS (recipientNumber, message) {
  params = {
    body: message,
    to: '+1' + recipientNumber,
    from: '+12026290642'
  }
  return client.messages.create(params)
    .then(() => {
      return {text: 'Your message was sent successfully!'}
    })
    .catch(() => {
      return {text: 'I was unable to send your message...'}
    })
}

module.exports = {
  sendSMS: sendSMS
}
