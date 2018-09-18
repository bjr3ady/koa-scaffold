const mongoose = require('mongoose')
const globalConfig = require('../globalConfig.json')
module.exports = mongoose.createConnection(globalConfig.DB_CONN, {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})