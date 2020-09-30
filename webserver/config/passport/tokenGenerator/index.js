const jwt = require('jsonwebtoken')

const TOKEN_DAYS_TIME = 10
const REFRESH_TOKEN_DAYS_TIME = 14

const ANDROID_TOKEN = 'Android'
const WEB_TOKEN = 'WebApplication'


module.exports = function (user, authSecret, type){
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
