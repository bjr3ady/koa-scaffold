const mongoose = require('mongoose')
const Schema = mongoose.Schema

let smsValidationEntity = new Schema({
  mobile: {
    type: String,
    Require: 'Target mobile number'
  },
  uid: {
    type: String,
    Require: 'Target user id'
  },
  validationCode: {
    type: String,
    Require: 'Sms validation code'
  },
  sentDatetime: {
    type: Date,
    Require: 'Sms sent datetime',
    default: Date.now
  },
  overtime: {
    type: Date,
    Require: 'Sms validation code overtime'
  }
}, {collection: 'smsvalidations'})
module.exports = smsValidationEntity