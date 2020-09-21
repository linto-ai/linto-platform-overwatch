const debug = require('debug')('linto-overwatch:overwatch:webserver:api:scopes')

class ScopesApi {
  constructor() {
  }

  formatAuth(user) {
    let mqttConfig = {
      mqtt_host: process.env.LINTO_STACK_DOMAIN,
      mqtt_port: process.env.LINTO_STACK_MQTT_PORT,
      mqtt_use_login: false
    }

    if (process.env.LINTO_STACK_MQTT_USE_LOGIN === 'true') {
      mqttConfig.mqtt_use_login = true
      mqttConfig.mqtt_password = process.env.LINTO_STACK_MQTT_PASSWORD
      mqttConfig.mqtt_login = process.env.LINTO_STACK_MQTT_USER
    }

    let output = {
      user: {
        ...user.token
      },
      mqtt: mqttConfig
    }

    if(user.salt)
      output.user.salt = user.salt
      
    return output
  }
}


module.exports = new ScopesApi()