const debug = require('debug')('linto-overwatch:webserver:config:passport:local')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const Users = require(process.cwd() + '/lib/overwatch/mongodb/models/linto_users')

const STRATEGY = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  Users.findOne({ email: username })
    .then((user) => {
      if (!user || !Users.validatePassword(password, user)) {
        return done(null, false, { errors: 'Invalid credential' })
      }

      return done(null, {
        _id: user.id,
        email: user.email,
        token: Users.toAuthJSON(user).token,
      })
    }).catch(done)
})

passport.use(STRATEGY)