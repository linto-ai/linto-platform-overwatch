const debug = require('debug')('linto-overwatch:webserver:config')


if (process.env.LINTO_STACK_OVERWATCH_AUTH_TYPE !== 'passthrough') {
  require(process.cwd() + '/webserver/config/passport/model/Users') // require to load model for passport utility
}

module.exports.loadAuth = () => {
  if (process.env.LINTO_STACK_OVERWATCH_AUTH_TYPE === '' || process.env.LINTO_STACK_OVERWATCH_AUTH_TYPE === 'passthrough') return undefined

  return process.env.LINTO_STACK_OVERWATCH_AUTH_TYPE.split(',').map(auth => {
    debug(`LOADED STRATEGY ${auth}`)
    return {
      ...require(`./auth/${auth}`),
    }
  })
}