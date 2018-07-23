const express = require('express')
const router = express.Router()
const outlook = require('../apis/outlook')

router.get('/', (req, res) => {
  res.render('feedback.ejs')
})

router.get('/submit', (req, res) => {

  msg = 'User Feedback: \n'
  msg += 'Name: ' + req.query.name + " " + req.query.surname + "\n"
  msg += 'Email: ' + req.query.email + "\n"
  msg += 'Message: ' + req.query.message + "\n"

  outlook.sendEmail('Calvin Feedback','ethantanen@yahoo.com',msg)

  res.redirect('/')
})

module.exports = {
  router: router
}
