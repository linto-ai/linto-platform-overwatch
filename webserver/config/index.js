const debug = require('debug')('linto-overwatch:webserver:config')

require(process.cwd()+'/webserver/config/passport/model/Users') // require to load model for passport utility

module.exports.loadAuth = () => {
  return process.env.AUTH_TYPE.split(',').map(auth => {
    debug(`LOADED STRATEGY ${auth}`)
    return {
      ...require(`./auth/${auth}`),
    }
  })
}