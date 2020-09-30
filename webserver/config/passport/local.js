const debug = require('debug')('linto-overwatch:webserver:config:passport:local')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const jwt = require('jsonwebtoken')

const { NoSlotAvailable } = require('../error/exception/auth')

const UsersAndroid = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')
const UsersWeb = require(process.cwd() + '/lib/overwatch/mongodb/models/webapp_hosts')
const WorkflowApplication = require(process.cwd() + '/lib/overwatch/mongodb/models/workflows_application')

const SlotsManager = require(process.cwd() + '/lib/overwatch/slotsManager/slotsManager')


const TOKEN_DAYS_TIME = 10
const REFRESH_TOKEN_DAYS_TIME = 14

const randomstring = require('randomstring')

const ANDROID_TOKEN = 'Android'
const STRATEGY_ANDROID = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => generateUserTokenAndroid(email, password, ANDROID_TOKEN, done))

function generateUserTokenAndroid(username, password, authType, done) {
  UsersAndroid.findOne({ email: username })
    .then(user => {
      if (!user || !UsersAndroid.validatePassword(password, user)) {
        return done(null, false, { errors: 'Invalid credential' })
      }

      const tokenSalt = randomstring.generate(12)
      UsersAndroid
        .update({ _id: user._id, keyToken: tokenSalt })
        .then(user => { if (!user) return done(null, false, { errors: 'Unable to generate keyToken' }) })

      return done(null, {
        _id: user.id,
        email: user.email,
        token: toAuthJSON(user, tokenSalt, authType).token,
      })
    }).catch(done)
}



const WEB_TOKEN = 'WebApplication'
const STRATEGY_WEB = new LocalStrategy({
  usernameField: 'originurl',
  passwordField: 'requestToken'
}, (url, requestToken, done) => generateUserTokenWeb(url, requestToken, WEB_TOKEN, done))

passport.use('local-web', STRATEGY_WEB)
passport.use('local-android', STRATEGY_ANDROID)

function generateUserTokenWeb(url, requestToken, authType, done) {
  UsersWeb.findOne({ originUrl: url })
    .then((webapp) => {
      let app = UsersWeb.validApplicationAuth(webapp, requestToken)
      webapp.application = app

      WorkflowApplication.getScopesById(app.applicationId).then(topic => {
        webapp.topic = topic
        webapp.sessionId = process.env.LINTO_STACK_OVERWATCH_WEB_TOPIC_KEY + randomstring.generate(12)

        if (SlotsManager.takeSlotIfAvailable(webapp.sessionId, app, url)) {
          return done(null, {
            _id: webapp._id,
            url: url,
            token: toAuthJSON(webapp, randomstring.generate(12), authType, app).token
          })
        } else return done(new NoSlotAvailable())
      }).catch(done)
    }).catch(done)
}

function toAuthJSON(user, authSecret, type) {
  let expiration_time_days = 60
  let data = {
    id: user._id
  }

  if (type === ANDROID_TOKEN) {
    data.email = user.email
    data.sessionId = process.env.LINTO_STACK_OVERWATCH_DEVICE_TOPIC_KEY + user._id
  } else if (type === WEB_TOKEN) {
    data.originUrl = user.originUrl
    data.applicationId = user.application.applicationId
    data.sessionId = user.sessionId
    data.topic = user.topic
    data.salt = authSecret
    expiration_time_days = 1
  }

  return {
    _id: user._id,
    token: generateJWT(data, authSecret + type, expiration_time_days, type)
  }
}

function generateJWT(data, authSecret, days = 60, type) {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + days)

  let auth_token = jwt.sign({
    data,
    exp: parseInt(expirationDate.getTime() / 1000, TOKEN_DAYS_TIME),
  }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET)

  if (type === ANDROID_TOKEN) {
    return {
      auth_token: auth_token,
      refresh_token: jwt.sign({
        data,
        exp: parseInt(expirationDate.getTime() / 1000, REFRESH_TOKEN_DAYS_TIME),
      }, authSecret + process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),

      expiration_date: parseInt(expirationDate.getTime() / 1000, 10),
      session_id: data.sessionId
    }
  } else {
    return {
      auth_token: auth_token,
      topic: data.topic,
      session_id: data.sessionId
    }
  }
}
