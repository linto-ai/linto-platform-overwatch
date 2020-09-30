const debug = require('debug')('linto-overwatch:webserver:config:passport:local')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const MongoAndroidUsers = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')
const MongoWebappHosts = require(process.cwd() + '/lib/overwatch/mongodb/models/webapp_hosts')
const MongoWorkflowApplication = require(process.cwd() + '/lib/overwatch/mongodb/models/workflows_application')

const SlotsManager = require(process.cwd() + '/lib/overwatch/slotsManager/slotsManager')
const TokenGenerator = require('./tokenGenerator')

const { NoSlotAvailable, InvalidCredential, UnableToGenerateKeyToken } = require('../error/exception/auth')

const randomstring = require('randomstring')

const ANDROID_TOKEN = 'Android'
const WEB_TOKEN = 'WebApplication'

const STRATEGY_ANDROID = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => generateUserTokenAndroid(email, password, done))
passport.use('local-android', STRATEGY_ANDROID)

function generateUserTokenAndroid(username, password, done) {
  MongoAndroidUsers.findOne({ email: username })
    .then(user => {
      if (!user || !MongoAndroidUsers.validatePassword(password, user)) return done(new InvalidCredential())

      let tokenData = {
        salt: randomstring.generate(12),
        sessionId: process.env.LINTO_STACK_OVERWATCH_DEVICE_TOPIC_KEY + user._id,
        email: user.email
      }

      MongoAndroidUsers.update({ _id: user._id, keyToken: tokenData.salt })
        .then(user => {
          if (!user) return done(new UnableToGenerateKeyToken())
        })
      return done(null, {
        _id: user.id,
        email: user.email,
        token: TokenGenerator(tokenData, ANDROID_TOKEN).token,
      })
    }).catch(done)
}



const STRATEGY_WEB = new LocalStrategy({
  usernameField: 'originurl',
  passwordField: 'requestToken'
}, (url, requestToken, done) => generateUserTokenWeb(url, requestToken, done))
passport.use('local-web', STRATEGY_WEB)


function generateUserTokenWeb(url, requestToken, done) {
  MongoWebappHosts.findOne({ originUrl: url })
    .then((webapp) => {
      let app = MongoWebappHosts.validApplicationAuth(webapp, requestToken)
      MongoWorkflowApplication.getScopesById(app.applicationId).then(topic => {
        let tokenData = {
          _id: webapp._id,
          originUrl: url,
          application: app.applicationId,
          topic: topic,
          sessionId: process.env.LINTO_STACK_OVERWATCH_WEB_TOPIC_KEY + randomstring.generate(12),
          salt: randomstring.generate(12)
        }

        if (SlotsManager.takeSlotIfAvailable(tokenData.sessionId, app, url)) {
          return done(null, {
            _id: webapp._id,
            url: url,
            token: TokenGenerator(tokenData, WEB_TOKEN).token
          })
        } else return done(new NoSlotAvailable())
      }).catch(done)
    }).catch(done)
}