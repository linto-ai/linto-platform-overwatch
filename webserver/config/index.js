const debug = require('debug')('linto-overwatch:webserver:config')

require(process.cwd()+'/webserver/config/passport/model/Users') // require to load model for passport utility

module.exports.loadAuth = () => {
  if(process.env.LINTO_OVERWATCH_AUTH_TYPE === '') return undefined

  return process.env.LINTO_OVERWATCH_AUTH_TYPE.split(',').map(auth => {
    debug(`LOADED STRATEGY ${auth}`)
    return {
      ...require(`./auth/${auth}`),
    }
  })
}