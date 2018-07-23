// published modules
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const session = require('express-session')
const logger = require('morgan')
const cors = require('cors')

/// require routes
const rec = require('./routes/authentication')
const con = require('./routes/conversation')
const add = require('./routes/addUser')
const admin = require('./routes/admin')
const feedback = require('./routes/feedback')

// create app
app = express()

// set view engine
app.set('view engine', 'ejs')

// add middleware
app.use(bodyParser({limit: '50mb'}))
app.use(express.static(__dirname + '/static'))
app.use(logger('dev'))
app.use(cors())
app.use(session({secret: 'calvinssecret'}))

// begin https server on port 8000
https.createServer({
  key: fs.readFileSync('./encryption/server.key'),
  cert: fs.readFileSync('./encryption/server.cert')
}, app).listen(8000, (err) => {
  if (err) { return console.log("Can't connect to port 8000.", err) }
  return console.log('Listening on port 8000')
})

// connect routers
app.use('/authenticate', rec.router)
app.use('/conversation', con.router)
app.use('/addUser', add.router)
app.use('/admin', admin.router)
app.use('/feedback',feedback.router)

// render homescreen
app.get('/', (req, res) => {
  res.render('index.ejs')
})
