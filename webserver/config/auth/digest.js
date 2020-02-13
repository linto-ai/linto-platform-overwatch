const debug = require('debug')('linto-overwatch:webserver:config:auth:digest')

require('../passport/digest')
const passport = require('passport')

module.exports = {
  authType: 'digest',
  authenticate: passport.authenticate('digest', { session: false })
}