const debug = require('debug')('linto-overwatch:webserver:config:auth:local')

require('../passport/local')
const passport = require('passport')
const jwt = require('express-jwt')

const mongoose = require('mongoose')
const Users = mongoose.model('Users')

module.exports = {
  authType: 'local',
  authenticate: passport.authenticate('local', { session: false }),
  isAuthenticate: [
    jwt({
      secret: 'secret',
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
    }),
    (req, res, next) => {
      const { payload: { id } } = req

      return Users.findById(id)
        .then((user) => {
          if (!user)
            return res.sendStatus(400)

          res.json({ user: user.toAuthJSON() })
          next()
        })
    }
  ]
}

function getTokenFromHeaders(req) {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }
  return null
}