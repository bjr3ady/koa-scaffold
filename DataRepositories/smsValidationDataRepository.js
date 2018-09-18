const { Mongooses } = require('../Entities')
let SmsValidationEntity = Mongooses.PlatformMongoose.model('SmsValidation')

let smsValidationDataRepository = {
  FindValidationByMobile: async function (mobile) {
    let validationData = await SmsValidationEntity.findOne({mobile: mobile}).exec()
    if (validationData) {
      return {
        actionResult: true,
        message: `Find validation data by mobile: ${mobile} success`,
        data: validationData
      }
    }
    return {
      actionResult: false,
      message: `Failed to find validation data by mobile: ${mobile}.`,
      data: undefined
    }
  },
  DeleteValidationsByUserId: async function (userId) {
    let removeData = await SmsValidationEntity.remove({uid: userId})
    if (removeData.ok) {
      return {
        actionResult: true,
        message: `Remove validations data by user id: ${userId}`,
        data: removeData
      }
    }
    return {
      actionResult: false,
      message: `Failed to remove validations data by user id: ${userId}`,
      data: undefined
    }
  },
  NewValidation: async function (mobile, uid, validationCode, sentDatetime, expired) {
    let newValidationData = new SmsValidationEntity({
      mobile: mobile,
      uid: uid,
      validationCode: validationCode,
      sentDatetime: sentDatetime,
      overtime: expired
    })
    let saveResult = await newValidationData.save()
    if (saveResult) {
      return {
        actionResult: true,
        message: `Create new validation data success.`,
        data: saveResult
      }
    }
    return {
      actionResult: false,
      message: `Failed to create new validation data.`,
      data: undefined
    }
  }
}
module.exports = smsValidationDataRepository