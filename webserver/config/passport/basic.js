const debug = require('debug')('linto-overwatch:webserver:config:passport:basic')

const mongoose = require('mongoose')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy

const Users = mongoose.model('Users')

const STRATEGY = new BasicStrategy((email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } })
      }
      return done(null, user)
    }).catch(done)
})

passport.use(STRATEGY)