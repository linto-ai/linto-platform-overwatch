const debug = require('debug')('linto-overwatch:webserver:config:passport:digest')

const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy

const Users = require(process.cwd()+'/lib/overwatch/mongodb/models/linto_users')

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