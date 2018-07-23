const outlook = require('./outlook')
const maps = require('./maps')
const random = require('./random')
const slack = require('./slack')
const dictionary = require('./dictionary')
const twilio = require('./twilio')

module.exports = {

  sendEmail: outlook.sendEmail,
  getMail: outlook.getMail,
  createMeeting: outlook.createMeeting,
  getTimeDest: maps.getTimeDest,
  getISSLocation: random.getISSLocation,
  getChuckNorrisFact: random.getChuckNorrisFact,
  getRandomNumberFact: random.getRandomNumberFact,
  getRonSwansonQuote: random.getRonSwansonQuote,
  searchWiki: random.searchWiki,
  getTheNews: random.getTheNews,
  getQuoteOfTheDay: random.getQuoteOfTheDay,
  getQuote: random.getQuote,
  getRecipe: random.getRecipe,
  getJoke: random.getJoke,
  getWeather: random.getWeather,
  sendSlackMessage: slack.postMessage,
  loveCalculator: random.loveCalculator,
  getDefinition: dictionary.getDefinition,
  getRestaurantInfo: random.getRestaurantInfo,
  sendSMS: twilio.sendSMS

  // help
  // dict
  // wolfram api
  // national holidary api

}
