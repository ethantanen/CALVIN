const ply = require('../utilities/polly')

// subfulfillers
const entertainment = require('./entertainment')
const tools = require('./tools')
const system = require('./system')
const information = require('./information')
const messanger = require('./messanger')

// api object for simple apis
const apis = require('../apis/index')

async function fulfill (req, res, next) {
  /**
   * These are intents that can be fulfilled with a simple
   * api call. They require no input and thusly require no
   * extra processing. The function defined below, titled
   * getResponse makes the api call and sends the returned audio
   * and text back to the client.
   */
  simple = {

    // entertainment
    'Joke': apis.getJoke,
    'RonSwansonQuote': apis.getRonSwansonQuote,
    'QuoteOfTheDay': apis.getQuoteOfTheDay,
    'ISSLocation': apis.getISSLocation,
    'RandomQuote': apis.getQuote,
    'RandomNumberFact': apis.getRandomNumberFact
  }

  /**
   * These are intents that either require user input or functionality
   * not provided by the files defined in the api directory. These intents
   * are roughly divided into entertainment, information, tools, messanger
   * and system related fulfillers.
   */

  functional = {

    // entertainment
    'LoveCalculator': entertainment.getLoveCalculator,

    // information
    'Recipe': information.getRecipe,
    'CheckWeather': information.getWeather,
    'GetTimeToDest': information.getTimeToDest,
    'SearchWiki': information.searchWiki,
    'TheNews': information.getTheNews,
    'Dictionary': information.getDefinition,
    'Restaurant': information.getRestaurantInfo,
    'TodaysDate': information.getTodaysDate,

    // tools
    'ScientificCalculator': tools.scientificCalculator,
    'GraphingCalculator': tools.graphingCalculator,
    'FileShare': tools.fileShare,
    'RandomNumber': tools.randomNumber,

    // messanger
    'SendSlack': messanger.sendSlackMessage,
    'SendEmail': messanger.sendOutlookEmail,
    'SendSMS': messanger.sendSMS,

    // system
    'FindJobTitle': system.getUsersByPosition,
    'DownloadRepo': system.downloadRepo,
    'FindEmail': system.getUsersByName,
    'FindLastName': system.getUsersByName,
    'LogOff': system.logOff,
    'Emotions': system.getEmotions,
    'Stop': system.stop
  }

  // fulfill intent or issue no intent found message
  if (Object.keys(simple).includes(req.session.intent)) {
    // intent requires a simple api get request
    func = simple[req.session.intent]
    json = await func()
    send(req, res, next, json.text)
  } else if (Object.keys(functional).includes(req.session.intent)) {
    // function requires additional work and functions are defined below
    console.log(req.session)
    func = functional[req.session.intent]
    func(req, res, next)
  } else {
    // a handler does not exist for these intents
    send(req, res, next, 'Sorry, I dont believe I can help with that right now. Please try again in the future or rephrase your intent.')
  }
}

// generate audio response and send to client
async function send (req, res, next, text) {
  stream = await ply.talk(text)
  res.send({audio: stream, text: text})
}

module.exports = {
  fulfill: fulfill
}
