const AWS = require('aws-sdk')

const lex = new AWS.LexRuntime({
  apiVersion: '2016-11-28',
  region: 'us-east-1'
})

const BOT_NAME = 'Calvin'
// The bot alias determines the version of calvin
const BOT_ALIAS = 'CALVIN_TWO'
/*
 * Change the content type to switch from
 * text input to audio input
 */
const CONTENT_TYPE = 'text/plain; charset=utf-8'
/*
 * The accept value determines the format that
 * the lex api returns responses in. 'text/plain'
 * for text and 'audio/*' for audio, where * takes
 * the value of the desired audio file format
 */
const ACCEPT = 'audio/*'

/*
 * Post text or video to lex
 * userId used to manage a users session/
 * keep track of the current state of the
 * users conversation
 */
function postContent (userId, text) {
  let params = {
    botAlias: BOT_ALIAS,
    botName: BOT_NAME,
    contentType: CONTENT_TYPE,
    userId: userId,
    accept: ACCEPT,
    inputStream: text
  }
  return new Promise((resolve, reject) => {
    lex.postContent(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

/*
 * Post text to lex
 */
function postText (userId, text) {
  let params = {
    botAlias: BOT_ALIAS,
    botName: BOT_NAME,
    userId: userId,
    inputText: text
  }
  return new Promise((resolve, reject) => {
    lex.postText(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

module.exports = {
  postContent: postContent,
  postText: postText
}
