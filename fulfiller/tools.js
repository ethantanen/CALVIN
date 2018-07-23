const ply = require('../utilities/polly')
const apis = require('../apis/index')
const uuidv1 = require('uuid/v1')

async function fileShare (req, res, next) {
  stream = await ply.talk('')
  html = "<iframe style='width:100%; height:400px' src='https://fast-river-89193.herokuapp.com/'></iframe>"
  sendHTML(req, res, next, 'Here is my file sharing software', html)
}

// render the calculator
async function graphingCalculator (req, res, next) {
  id = uuidv1()

  text =
  'Graphing Calculator: ' +
  '<script>' +
  "$('#thingToAppend').append(\"<div id='" + id + "' style='height:450px;width=500px'></div>\");" +
  "var elt = document.getElementById('" + id + "'); " +
  'var calculator = Desmos.GraphingCalculator(elt);' +
  "calculator.setExpression({id:'graph1', latex:'y=x^2'});" +
  '</script>'

  stream = await ply.talk('Here\s the graphing calculator')
  res.send({audio: stream, text: text})
}

async function scientificCalculator (req, res, next) {
  id = uuidv1()

  text = 'Scientific Calculator: ' +
  '<script>' +
  "$('#thingToAppend').append(\"<div id='" + id + "' style='height:450px;width=500px'></div>\");" +
  "var elt = document.getElementById('" + id + "');" +
  'var calculator = Desmos.ScientificCalculator(elt);' +
  '</script>'

  stream = await ply.talk('Behold! A Scientific Calculator!')
  res.send({audio: stream, text: text})
}

async function randomNumber (req, res, next) {
  num = Math.floor(Math.random() * 1000000)
  text = "Here's a random number: " + num
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

// generate audio response and send to client
async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

async function sendHTML (req, res, next, audio, html) {
  text = "<script>$('#thingToAppend').append(\"" + html + '") </script>'
  stream = await ply.talk(audio)
  res.send({audio: stream, text: text})
}

module.exports = {
  fileShare: fileShare,
  graphingCalculator: graphingCalculator,
  scientificCalculator: scientificCalculator,
  randomNumber: randomNumber
}
