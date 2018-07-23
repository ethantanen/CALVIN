
const request = require('request-promise')

// api credentials
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_GRAPH
const CLIENT_SECRET = process.env.CLIENT_SECRET_GRAPH
const CLIENT_ID = process.env.CLIENT_ID_GRAPH

// other constant information
const API_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
const REDIRECT_URL = 'https://localhost:8000/admin/auth' // must register url in graph's app regisstration protal
const SCOPE =
  'openid+offline_access+profile+https:%2f%2foutlook.office.com%2fmail.readwrite+https:%2f%2foutlook.office.com%2fmail.readwrite.shared+https:%2f%2foutlook.office.com%2fmail.send+https:%2f%2foutlook.office.com%2fmail.send.shared+https:%2f%2foutlook.office.com%2fcalendars.readwrite+https:%2f%2foutlook.office.com%2fcalendars.readwrite.shared+https:%2f%2foutlook.office.com%2fcontacts.readwrite+https:%2f%2foutlook.office.com%2fcontacts.readwrite.shared+https:%2f%2foutlook.office.com%2ftasks.readwrite+https:%2f%2foutlook.office.com%2ftasks.readwrite.shared+https:%2f%2foutlook.office.com%2fmailboxsettings.readwrite+https:%2f%2foutlook.office.com%2fpeople.read+https:%2f%2foutlook.office.com%2fuser.readbasic.all'

async function sendEmail (sender, recipient, message) {
  msg = {
    'Message': {
      'Subject': 'CALVIN: Message from ' + sender,
      'Body': {
        'ContentType': 'Text',
        'Content': message
      },
      'ToRecipients': [
        {
          'EmailAddress': {
            'Address': recipient
          }
        }
      ]
    },
    'SaveToSentItems': 'true'
  }

  token = await getAccessToken()

  options = {
    method: 'POST',
    url: 'https://outlook.office.com/api/v2.0/me/sendmail',
    headers: {
      Authorization: 'Bearer ' + JSON.stringify(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg)
  }

  // send email and log errors
  request(options)
    .then((data) => {
      console.log('sent email')
    })
    .catch((err) => {
      console.log('sent email')
      console.log('Error Sending Email', JSON.stringify(err, null, 1))
    })
}

// TODO: content should include meeting time and lex should use date slot
async function createMeeting (organizer, attendees, start, end) {
  token = await getAccessToken()

  msg = {
    Subject: 'CALVIN: permission to update your calender?',
    Body: {
      ContentType: 'HTML',
      Content: organizer + ' would like to schedule a meeting.'
    },
    Start: {
      DateTime: start,
      TimeZone: 'Eastern Standard Time'
    },
    End: {
      DateTime: end,
      TimeZone: 'Eastern Standard Time'
    },
    Location: {
      DisplayName: 'Bullpen',
      LocationEmailAddress: 'conf16@VENTERA.com'
    },
    Attendees: [
      {
        EmailAddress: {
          Address: attendees
        }
      }
    ]
  }

  options = {
    method: 'POST',
    url: 'https://outlook.office.com/api/v2.0/me/events',
    headers: {
      Authorization: 'Bearer' + token,
      ContentType: 'application/json'
    },
    body: JSON.stringify(msg)
  }

  request(options)
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

function getAccessToken () {
  link = 'grant_type=refresh_token&refresh_token=' + REFRESH_TOKEN + '&scope=' + SCOPE + '&redirect_uri=' + REDIRECT_URL + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
  options = {
    method: 'POST',
    url: API_URL,
    headers: {
      contentType: 'application/x-www-form-urlencoded'
    },
    form: link,
    json: true
  }
  return request(options)
    .then((data) => {
      return data.access_token
    })
    .catch((err) => {
      console.log('Couldnt get token', err)
    })
}

module.exports = {
  sendEmail: sendEmail,
  createMeeting: createMeeting

}
