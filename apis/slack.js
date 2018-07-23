var slack = require('slack')

const TOKEN = process.env.SLACK_TOKEN
// in the future if we store everyones slack tokens in the encrypted in the database chage sendAsUser to true
// so that It can send as the user.
function postMessage (postChannel, text) {
  var channelID // this will be the id of the channel to send to
  var sendAsUser = 'false'
  var botName = 'Calvin'
  // get a list of all the channels to check that it is a channel, if it is not it attempts to send it as an IM
  return slack.channels.list({token: TOKEN})
    .then((data) => {
      var flag = false
      var channelID
      for (i = 0; i < data.channels.length; i++) {
        if (postChannel.includes(data.channels[i].name_normalized)) {
          channelID = data.channels[i].id
          flag = true
          break
        }
      }

      if (!flag) {
        // channel cant be found post an im instead
        postChannel = '@' + postChannel
        return slack.chat.postMessage({token: TOKEN, channel: postChannel, text: text, as_user: sendAsUser, username: botName})
          .then(() => {
            return {text: 'Message sent successfully!'}
          })
      } else {
        // send message normally
        return slack.chat.postMessage({token: TOKEN, channel: channelID, text: text, as_user: sendAsUser, username: botName})
          .then(() => {
            return {text: 'Message sent successfully!'}
          })
      }
    })
    .catch((err) => {
      console.log('error loading channels: ' + err)
      return {text: 'Unable to send slack message.'}
    })
}

module.exports = {
  postMessage: postMessage
}
