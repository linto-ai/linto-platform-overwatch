const debug = require('debug')('linto-overwatch:webserver:config:auth:basic')

require('../passport/basic')
const passport = require('passport')

module.exports = {
  authType: 'basic',
  authenticate: passport.authenticate('basic', { session: false })
}
