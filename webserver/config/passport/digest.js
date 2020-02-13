const debug = require('debug')('linto-overwatch:webserver:config:passport:digest')

const mongoose = require('mongoose')
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy

const Users = mongoose.model('Users')

let strategy = new DigestStrategy({ qop: 'auth' },
  (username, done) => {
    Users.findOne({ email: username }).then((user) => {
      if (!user) return done(null, false)

      debug('TODO: SHOULD MANAGE USER PASSWORD HERE')
      return done(null, user, user.hash)
    })
  },
  (params, done) => {
    return done(null, true)
  }
)

passport.use(strategy)