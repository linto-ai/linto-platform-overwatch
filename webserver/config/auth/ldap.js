const debug = require('debug')('linto-overwatch:webserver:config:auth:ldap')

require('../passport/ldap')
const passport = require('passport')

module.exports = {
  authType: 'ldap',
  authenticate: passport.authenticate('ldapauth', { session: false })
}