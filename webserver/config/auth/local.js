const debug = require('debug')('linto-overwatch:webserver:config:auth:local')

require('../passport/local')
const passport = require('passport')
const jwt = require('express-jwt')

const UsersAndroid = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')

//TODO: WIP need to implement the web_auth system
const UsersWeb = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')

module.exports = {
  authType: 'local',
  authenticate_android: passport.authenticate('local-android', { session: false }),
  authenticate_web: passport.authenticate('local-web', { session: false }),
  isAuthenticate: [
    jwt({
      secret: generateSecretFromHeaders,
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    }),
    (req, res, next) => {
      next()
    }
  ]
}

function generateSecretFromHeaders(req, payload, done) {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Android') {
    UsersAndroid.findOne({ email: payload.email })
      .then((user) => {
        done(null, user.keyToken + authorization.split(' ')[0] + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET)
      })
  }
  else if (authorization && authorization.split(' ')[0] === 'WebApplication') {
    UsersWeb.findOne({ email: payload.email })
      .then((user) => {
        done(null, user.keyToken + authorization.split(' ')[0] + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET)
      })
  }else {
    done('Unknown token type')
  }

}

function getTokenFromHeaders(req) {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Android') {
    return authorization.split(' ')[1]
  }
  if (authorization && authorization.split(' ')[0] === 'WebApplication') {
    return authorization.split(' ')[1]
  }
  return null
}