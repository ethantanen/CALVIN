const moment = require('moment')
const apis = require('../apis/index')
const ply = require('../utilities/polly')

// get the number of minutes from ventera to a location
async function getTimeToDest (req, res, next) {
  let json = await apis.getTimeDest(req.session.slots.LOCATION)
  send(req, res, next, json.text)
}

// get the weather for a particular location
async function getWeather (req, res, next) {
  let json = await apis.getWeather(req.session.slots.LOCATION)
  let stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// get a saucy recipe
async function getRecipe (req, res, next) {
  let json = await apis.getRecipe(req.session.slots.FOODDISH)
  let stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

// get a random new article
async function getTheNews (req, res, next) {
  let json = await apis.getTheNews()
  let stream = await ply.talk(json.text)
  res.send({audio: stream, text: "<a href='" + json.extras + "'> Visit Article </a>"})
}

// query wikipedia
async function searchWiki (req, res, next) {
  let json = await apis.searchWiki(req.session.slots.TOPIC)
  send(req, res, next, json.text)
}

// get the defintion of a word
async function getDefinition (req, res, next) {
  let word = req.session.slots.WORD
  let json = await apis.getDefinition(word)
  let stream = await ply.talk(json.text)
  res.send({audio: stream, text: json.extras})
}

async function getRestaurantInfo (req, res, next) {
  let json = await apis.getRestaurantInfo(req.session.slots.PLACE)
  let text = '<script>'
  text += "$('#thingToAppend').append($(\"" + json.extras + '"));'
  text += '</script>'

  res.send({audio: undefined, text: text})
}

async function getTodaysDate (req, res, next) {
  let text = 'The current date-time is ' + moment().format('MMMM Do YYYY, h:mm:ss a')
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
  getTimeToDest: getTimeToDest,
  getRestaurantInfo: getRestaurantInfo,
  getTheNews: getTheNews,
  getRecipe: getRecipe,
  getTheNews: getTheNews,
  getWeather: getWeather,
  searchWiki: searchWiki,
  getTodaysDate: getTodaysDate,
  getDefinition: getDefinition

}
