const ply = require('../utilities/polly')
const apis = require('../apis/index')

async function getLoveCalculator (req, res, next) {
  json = await apis.loveCalculator(req.session.slots.FIRST, req.session.slots.SECOND)
  send(req, res, next, json)
}

// stop
async function getRandomImage (req, res, next) {
  url = 'https://picsum.photos/500?image=' + Math.floor(Math.random() * 300)
  html = "<img style='border-radius:0%; height:300px; width:300px;' class='img-fluid' src='" + url + "' height='300px' width='300px'> </img>"
  sendHTML(req, res, next, 'heres a random number', html)
}

async function sendHTML (req, res, next, audio, html) {
  text = "<script>$('#thingToAppend').append(\"" + html + '") </script>'
  stream = await ply.talk(audio)
  res.send({audio: stream, text: text})
}

// generate audio response and send to client
async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  getLoveCalculator: getLoveCalculator
}
