const debug = require('debug')('linto-overwatch:webserver:config:passport:local')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const UsersAndroid = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')
//TODO: WIP need to implement the web_auth system
const UsersWeb = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')


const jwt = require('jsonwebtoken')
const TOKEN_DAYS_TIME = 10
const REFRESH_TOKEN_DAYS_TIME = 14

const randomstring = require('randomstring')


const ANDROID_WEB = 'Android'
const STRATEGY_ANDROID = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  generateUserTokenAndroid(email, password, ANDROID_WEB, done)
})

function generateUserTokenAndroid(username, password, authType, done) {
  UsersAndroid.findOne({ email: username })
    .then(user => {
      if (!user || !UsersAndroid.validatePassword(password, user)) {
        return done(null, false, { errors: 'Invalid credential' })
      }

      const tokenSalt = randomstring.generate(12)
      UsersAndroid.update({
        _id: user._id,
        keyToken: tokenSalt
      }).then(user => {
        if (!user)
          return done(null, false, { errors: 'Unable to generate keyToken' })
      })

      return done(null, {
        _id: user.id,
        email: user.email,
        token: toAuthJSON(user, tokenSalt + authType).token,
      })
    }).catch(done)
}



const TOKEN_WEB = 'WebApplication'
const STRATEGY_WEB = new LocalStrategy({
  usernameField: 'url',
  passwordField: 'requestToken'
}, (requestToken, url, done) => {
  generateUserTokenWeb(url, requestToken, TOKEN_WEB, done)
})


passport.use('local-web', STRATEGY_WEB)
passport.use('local-android', STRATEGY_ANDROID)


function generateUserTokenWeb(username, password, authSecret, done) {
  UsersWeb.findOne({ email: username })
    .then((user) => {
      if (!user || !UsersWeb.validatePassword(password, user)) {
        return done(null, false, { errors: 'Invalid credential' })
      }
      return done(null, {
        _id: user.id,
        email: user.email,
        token: toAuthJSON(user, authSecret).token,
      })
    }).catch(done)
}

function generateJWT(user, authSecret) {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return {
    auth_token: jwt.sign({
      email: user.email,
      id: user._id,
      exp: parseInt(expirationDate.getTime() / 1000, TOKEN_DAYS_TIME),
    }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),
    refresh_token: jwt.sign({
      email: user.email,
      id: user._id,
      exp: parseInt(expirationDate.getTime() / 1000, REFRESH_TOKEN_DAYS_TIME),
    }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),

    expiration_date: parseInt(expirationDate.getTime() / 1000, 10),
    session_id: user._id
  }
}

function toAuthJSON(user, authSecret) {
  let token = generateJWT(user, authSecret)
  return {
    _id: user._id,
    email: user.email,
    token: token,
  }
}