const users = require('../models/users')
const ply = require('../utilities/polly')
const apis = require('../apis/index')

// calvin logs you off!
async function logOff (req, res, next) {
  req.session.destroy()
  send(req, res, next, 'You have been logged off.')
}

// calvin tells you about your perty smile
async function getEmotions (req, res, next) {
  // couple response options
  let em = req.session.face.FaceDetails[0].Emotions
  let em1 = 'I would say you look ' + em[0].Type + ' and I say that with ' + em[0].Confidence.toFixed(4) + ' percent confidence.'
  let em2 = 'Heres a list of your emotions in decreasing confidence. You look ' + em[0].Type + ', ' + em[1].Type + ', and ' + em[2].Type + '.'

  // randomly choose a phrase
  let options = [em1, em2]
  let index = Math.floor(Math.random() * options.length)
  let text = options[index]

  send(req, res, next, text)
}

// get the link to download the CALVIN repo
async function downloadRepo (req, res, next) {
  let text = 'Please click on the provided link to download my git repository. Have fun with it!'
  let extras = "Download my innards: <a href='https://github.com/ethantanen/File-Share-API/zipball/master'>click me </a>"
  let stream = await ply.talk(text)
  res.send({audio: stream, text: extras})
}

// query the database for a user with the provided name
async function getUsersByName (req, res, next) {
  let name = req.session.slots.FIRSTNAME
  let list = await users.scanUsersByName(name)

  if (list.length == 0) return send(req, res, next, 'I could not find anyone named ' + name)

  let text = 'The first person with the name ' + name + ' has the following email address: ' + list[0].EMAIL
  let stream = await ply.talk(text)
  res.send({audio: stream, text: JSON.stringify(list, null, 1)})
}

// query the database for a user with the provided position
async function getUsersByPosition (req, res, next) {
  let position = req.session.slots.JOBTITLE
  let list = await users.scanUsersByPosition(position)

  if (list.length == 0) return send(req, res, next, 'I could not find any with the following position: ' + position)

  let text = 'The first person that fits that description is ' + list[0].FIRST_NAME + ' ' + list[0].LAST_NAME + '. They are a ' + list[0].POSITION + ' and their email is ' + list[0].EMAIL
  let extras = JSON.stringify(list, null, 1)
  let stream = await ply.talk(text)
  res.send({audio: stream, text: extras})
}

// stop
async function stop (req, res, next) {
  let audio = await ply.talk('')
  res.send({audio: audio, text: 'Ending intent'}) // "Ending intent..."
}

// get personal information
function getPersonalInformation (req, res, next) {

}

// reject add user
function addUser( req, res, next) {
  text = 'It appears that you are currently logged in. If you dont believe this to be the case log the current user off with the "Log Off" command'
  send(req, res, next, text)
}

// generate audio response and send to client
async function send (req, res, next, text) {
  let stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

async function sendHTML (req, res, next, audio, html) {
  let text = "<script>$('#thingToAppend').append(\"" + html + '") </script>'
  let stream = await ply.talk(audio)
  res.send({audio: stream, text: text})
}

module.exports = {
  stop: stop,
  getUsersByPosition: getUsersByPosition,
  getUsersByName: getUsersByName,
  getPersonalInformation: getPersonalInformation,
  downloadRepo: downloadRepo,
  getEmotions: getEmotions,
  logOff: logOff
}
