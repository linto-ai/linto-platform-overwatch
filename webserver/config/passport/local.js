const debug = require('debug')('linto-overwatch:webserver:config:passport:local')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const UsersAndroid = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')
const UsersWeb = require(process.cwd() + '/lib/overwatch/mongodb/models/webapp_users')


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

      let authSecret = tokenSalt + authType

      return done(null, {
        _id: user.id,
        email: user.email,
        token: toAuthJSON(user, authSecret, authType).token,
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


function generateUserTokenWeb(url, requestToken, authType, done) {
  UsersWeb.findOne({ originUrl: url })
    .then((user) => {
      if (!user || !UsersWeb.validToken(requestToken, user)) {
        return done(null, false, { errors: 'Invalid credential' })
      }

      let tokenSalt = "temp" //TODO: WIP
      let authSecret = authType

      //TODO: MANAGE NO MORE SLOT
      return done(null, {
        _id: user._id,
        url: url,
        token: toAuthJSON(user, authSecret, authType).token,
      })
    }).catch(done)
}

function generateJWT(data, authSecret) {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return {
    auth_token: jwt.sign({
      data,
      exp: parseInt(expirationDate.getTime() / 1000, TOKEN_DAYS_TIME),
    }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),
    refresh_token: jwt.sign({
      data,
      exp: parseInt(expirationDate.getTime() / 1000, REFRESH_TOKEN_DAYS_TIME),
    }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),

    expiration_date: parseInt(expirationDate.getTime() / 1000, 10),
    session_id: data.sessionId
  }
}

function toAuthJSON(user, authSecret, type) {
  let data = {
    id: user._id
  }
  if (type === ANDROID_WEB) {
    data.email = user.email
    data.sessionId = user._id
  } else if (type === TOKEN_WEB) {
    data.originUrl = user.originUrl
    data.sessionId = randomstring.generate(5)
  }

  let token = generateJWT(data, authSecret)

  return {
    _id: user._id,
    token: token
  }
}