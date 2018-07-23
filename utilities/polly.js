/*
 * synthesizeSpeech
 */

// Published modules
const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

// Create Polly service object
let polly = new AWS.Polly({
  apiVersion: '2016-06-10'
})

// Synthesize Speech
function synthesizeSpeech (text) {
  let params = {
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: text,
    VoiceId: 'Matthew'
  }
  return new Promise((resolve, reject) => {
    polly.synthesizeSpeech(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

/**
 * This function uses polly to convert text to
 * speech
 */
async function talk (text) {
  data = await synthesizeSpeech(text)
  return data.AudioStream
}

module.exports = {
  synthesizeSpeech: synthesizeSpeech,
  talk: talk
}
