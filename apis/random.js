const request = require('request-promise')

async function getISSLocation() {
  json = await request({url: 'http://api.open-notify.org/iss-now.json', json: true})
  return {
    text: 'The ISS is currently at longitude: ' + json.iss_position.longitude + ' and latitude ' + json.iss_position.latitude + '.'
  }
}

async function getChuckNorrisFact() {
  json = await request({url: 'https://api.chucknorris.io/jokes/random', json: true})
  return {text: json.value}
}

// limit to 5 an hour...ouch
async function getMinionTranslation(text) {
  options = {
    method: 'POST',
    url: 'http://api.funtranslations.com/translate/minion.json?text=' + text,
    json: true
  }
  json = await request(options)
  return {text: json.contents.translated}
}

async function getRandomNumberFact() {
  json = await request({url: 'http://numbersapi.com/random/trivia', json: true})
  return {text: json}
}

async function getRonSwansonQuote() {
  json = await request({url: 'http://ron-swanson-quotes.herokuapp.com/v2/quotes', json: true})
  return {text: json[0]}
}

async function searchWiki(text) {
  json = await request({
    url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + text,
    json: true
  })
  console.log(JSON.stringify(json, null, 1))
  return {
    text: json.query.pages[Object.keys(json.query.pages)[0]].extract
  }
}

async function getTheNews() {
  token = process.env.NEWS
  url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + token
  json = await request({url: url, json: true})
  index = Math.floor(Math.random(json.totalResults))
  title = json.articles[index].title
  article = json.articles[index].description
  url = json.articles[index].url
  text = 'There exists an article with title: ' + title + '. Here is a brief description: ' + article
  return {text: text, extras: url}
}

async function getQuoteOfTheDay() {
  url = 'http://quotes.rest/qod.json'
  json = await request({url: url, json: true})
  return {
    text: json.contents.quotes[0].quote + ' ... ' + json.contents.quotes[0].author
  }
}

async function getRecipe(keyword) {
  key = process.env.RECIPE

  // query database
  search = 'http://food2fork.com/api/search?q=' + keyword + '&key=' + key
  search = await request({url: search, json: true})

  // get recipe
  recipe = 'http://food2fork.com/api/get?rId=' + search.recipes[0].recipe_id + '&key=' + key
  recipe = await request({url: recipe, json: true})

  return {
    text: 'Heres a recipe titled: ' + recipe.recipe.title,
    extras: recipe.recipe.ingredients
  }
}

async function getJoke() {
  json = await request({
    url: 'https://icanhazdadjoke.com/',
    json: true,
    headers: {
      'Accept': 'application/json'
    }
  })
  return {text: json.joke}
}

async function getWeather(city) {
  try {
    options = {
      url: 'http://api.openweathermap.org/data/2.5/weather?appid=47639444acd3350e5a67c5b42f6e6495&q=' + city,
      json: true
    }
    json = await request(options)

    // grab wanted information
    description = json.weather[0].description
    temp = json.main.temp
    humidity = json.main.humidity
    city = json.name

    // format responses
    text = 'It is ' + temp + ' degrees in ' + city + ' with humidity levels around ' + humidity + ' percent. There are ' + description
    extras = JSON.stringify(json.main)

    return {text: text, extras: extras.toString()}
  } catch (err) {
    text = 'I dont have data on the city you have requested. Please try again with a differant alias.'
    return text
  }
}

// get random quote, either famous persons or movie quotes
async function getQuote() {
  endpoints = ['famous', 'movies']
  endpoint = endpoints[Math.floor(Math.random(2))]
  options = {
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=' + endpoint + '&count=1',
    json: true,

    headers: {
      'X-Mashape-Key': 'jLowL9VQ9CmshLR1eNzx8hVKJIxKp1RVGp7jsn3gcL8xqPRolM',
      'Accept': 'application/json'
    }
  }
  json = await request(options)
  return {
    text: json[0].quote + ' ... ' + json[0].author
  }
}

async function loveCalculator(name1, name2) {
  options = {
    url: 'https://love-calculator.p.mashape.com/getPercentage?fname=' + name1 + '&sname=' + name2,
    json: true,
    headers: {
      'X-Mashape-Key': 'jLowL9VQ9CmshLR1eNzx8hVKJIxKp1RVGp7jsn3gcL8xqPRolM',
      'Accept': 'application/json'
    }
  }
  json = await request(options)
  return 'Greetings ' + name1 + ' and ' + name2 + '. You have a ' + json.percentage + ' percent match. ' + json.result + '.'
}

async function getRestaurantInfo(restaurant) {
  key = '8ec44e2fa79f8312424cc3f486110554'
  options = {
    url: 'https://developers.zomato.com/api/v2.1/search?count=5&q=Chipotle' ,
    json: true,
    headers: {
      'user-key': key
    }
  }
  json = await request(options)
  console.log("JSON",json)
  content = json.restaurants
  title = 'restaurant.name'
  keys = ['restaurant.location.address', 'restaurant.user_rating.aggregate_rating', 'restaurant.url']
  return {
    text: 'testing',
    extras: formatPrintOut('Restaurant Query:', title, keys, content)
  }
}

// title is key to content object title ...
function formatPrintOut(responseTitle, cardTitle, keys, content) {
  printout = '<h1>' + responseTitle + '</h1>'
  printout += "<div class='panel panel-primary'>"
  content.forEach((info) => {
    printout += "<div class='panel-heading'>" + navJSON(info, title) + '</div>'
    keys.forEach((item) => {
      printout += "<div class='panel-body'>" + navJSON(info, item) + '</div>'
    })
  })
  printout += '</div>'
  return printout
}

// navigate the json object based on the key of the form 'key1.key2.key3...'
function navJSON(json, key) {
  j = json
  ks = key.split('.')
  ks.forEach((ele) => {
    j = j[ele]
  })
  return j
}

module.exports = {
  getISSLocation: getISSLocation,
  getChuckNorrisFact: getChuckNorrisFact,
  getRandomNumberFact: getRandomNumberFact,
  getRonSwansonQuote: getRonSwansonQuote,
  searchWiki: searchWiki,
  getTheNews: getTheNews,
  getQuoteOfTheDay: getQuoteOfTheDay,
  getQuote: getQuote,
  getRecipe: getRecipe,
  getJoke: getJoke,
  getWeather: getWeather,
  loveCalculator: loveCalculator,
  getRestaurantInfo: getRestaurantInfo

}
