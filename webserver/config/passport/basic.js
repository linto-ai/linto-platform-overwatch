const debug = require('debug')('linto-overwatch:webserver:config:passport:basic')

const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy

const Users = require(process.cwd()+'/lib/overwatch/mongodb/models/android_users')

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