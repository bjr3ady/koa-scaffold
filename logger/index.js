const log4js = require('log4js')
const globalConfig = require('../globalConfig.json')
log4js.configure({
  appenders: { platform: {type: 'file', filename: `./logs/${globalConfig.APP_NAME}.log`}},
  categories: { default: { appenders : ['platform'], level: 'debug'}}
})

let logger = log4js.getLogger('platform')
module.exports = logger