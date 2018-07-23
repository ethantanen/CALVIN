const request = require('request-promise')
const TOKEN = process.env.MAP_TOKEN

// directions
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions')
const directionsClient = mbxDirections({ accessToken: TOKEN })

// geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxGeocoding({ accessToken: TOKEN })

// get time to coords
function getDuration (coords) {
  return directionsClient
    .getDirections({
      waypoints: [
        {
          coordinates: [ -77.335991, 38.943761 ],
          approach: 'unrestricted'
        },
        {
          coordinates: coords
        }
      ]
    })
    .send()
    .then(response => {
      return duration = Math.floor(response.body.routes[0].duration / 60)// in seconds
    })
    .catch((err) => {
      console.log(err)
    })
}

// get coords of query
function geocoder (query) {
  return geocodingClient
    .forwardGeocode({
      query: query,
      limit: 2
    })
    .send()
    .then(response => {
      return response.body.features[0].center
    })
}

// get time to query in minutes
async function getTimeDest (query) {
  try {
    coords = await geocoder(query)
    duration = await getDuration(coords)
    return {text: 'It would take ' + duration + ' minutes to get to your destination if you left now.'}
  } catch (err) {
    text = "Sorry! I cannot find a city by the given name."
    return {text: text}
  }
}

module.exports = {
  getTimeDest: getTimeDest
}
