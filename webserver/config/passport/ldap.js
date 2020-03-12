const debug = require('debug')('linto-overwatch:webserver:config:passport:ldap')

let passport = require('passport')
let LdapStrategy = require('passport-ldapauth').Strategy;


const OPTS = {
  usernameField: 'username',
  passwordField: 'password',

  server: {
    url: process.env.LINTO_STACK_OVERWATCH_AUTH_LDAP_SERVER_URL,
    searchBase: process.env.LINTO_STACK_OVERWATCH_AUTH_LDAP_SERVER_SEARCH_BASE,
    searchFilter: process.env.LINTO_STACK_OVERWATCH_AUTH_LDAP_SERVER_SEARCH_FILTER
  }
}

passport.use(new LdapStrategy(OPTS,
  function (user, done) {
    return done(null, user)
  }
))