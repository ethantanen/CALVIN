
const request = require('request-promise')
const router = require('express').Router()
const ply = require('../utilities/polly')

// Outlook credentials
const TOKEN = process.env.REGRESHTOKEN_GRAPH
const CLIENT_SECRET = process.env.CLIENT_SECRET_GRAPH
const CLIENT_ID = process.env.CLIENT_ID_GRAPH
const REDIRECT_URL = 'https://localhost:8000/admin/auth'
const SCOPE =
  'openid+offline_access+profile+https:%2f%2foutlook.office.com%2fmail.readwrite+https:%2f%2foutlook.office.com%2fmail.readwrite.shared+https:%2f%2foutlook.office.com%2fmail.send+https:%2f%2foutlook.office.com%2fmail.send.shared+https:%2f%2foutlook.office.com%2fcalendars.readwrite+https:%2f%2foutlook.office.com%2fcalendars.readwrite.shared+https:%2f%2foutlook.office.com%2fcontacts.readwrite+https:%2f%2foutlook.office.com%2fcontacts.readwrite.shared+https:%2f%2foutlook.office.com%2ftasks.readwrite+https:%2f%2foutlook.office.com%2ftasks.readwrite.shared+https:%2f%2foutlook.office.com%2fmailboxsettings.readwrite+https:%2f%2foutlook.office.com%2fpeople.read+https:%2f%2foutlook.office.com%2fuser.readbasic.all'

// check for authentication
auth = async (req, res, next) => {
  password = process.env.ADMIN_PASSWORD
  username = process.env.ADMIN_USERNAME
  console.log(password, req.query.password, username, req.query.username)
  if (req.query.username === username && req.query.password === password && req.query.username && req.query.password) {
    next()
  } else {
    res.send("<h1> You Are Not Permitted To Access This Part Of The Site! </h1> <br> <a href='/'> homepage </a>")
  }
}

// render microsoft's authentication page
router.get('/login', auth, (req, res) => {
  var stateParam = Math.random() * new Date().getTime()
  var authServer = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?'
  var authUrl = authServer + 'response_type=code&client_id=' + CLIENT_ID + '&scope=' + SCOPE + '&redirect_uri=' + REDIRECT_URL + '&state=' + stateParam + '&prompt=login'
  res.redirect(authUrl)
})

// grab validation code from url and get refresh token
router.get('/auth', (req, res) => {
  code = req.query.code
  getRefreshToken(code)
  res.redirect('/')
})

// get refresh token and populate global variable
function getRefreshToken (code) {
  options = {
    method: 'POST',
    uri: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: {
      contentType: 'application/x-www-form-urlencoded'
    },
    form: 'grant_type=authorization_code&code=' + code + '&scope=' + SCOPE + '&redirect_uri=' + REDIRECT_URL + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET,
    json: true
  }
  request(options)
    .then(async (data) => {
      token = data.refresh_token
      console.log('REFRESH TOKEN:\n ' + token)
    })
    .catch((err) => {
      console.log('ERROR GETTING TOKEN ', err)
    })
}

module.exports = {
  router: router
}
