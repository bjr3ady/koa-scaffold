const _ = require('lodash')
const axios = require('axios')
const globalConfig = require('../globalConfig.json')
const { SmsValidationDataRepository } = require('../DataRepositories')

module.exports = {
  SendSmsCode: async function (valiCode, userId, mobileNum) {
    let newSmsValidationResult = await SmsValidationDataRepository.NewValidation(
      mobileNum,
      userId,
      valiCode,
      _.now(),
      _.now() + (1000 * 60 * 3) //3 minutes
    )

    if (!newSmsValidationResult.actionResult) {
      return newSmsValidationResult
    }

    //Call sms api
    let smsApiUri = globalConfig.SMS_SEND_API
    if (smsApiUri) {
      let smsApiResponse = await axios({
        method: 'GET',
        url: `${smsApiUri}`,
        params: {
          
        }
      }).catch(function (err) {
        return {
          actionResult: false,
          data: err,
          message: `New sms sent to:${mobileNum} failed.`
        }
      })
      if (smsApiResponse && smsApiResponse.status) {
        let msg = ''
        if (globalConfig.ALLOW_SMS_FEEDBACK) {
          msg = `New sms:${valiCode} sent to:${mobileNum} success.`
        } else {
          msg = `New sent to:${mobileNum} success.`
        }
        return {
          actionResult: true,
          data: smsApiResponse.data,
          message: msg
        }
      }
      return {
        actionResult: false,
        data: smsApiResponse.data,
        message: `New sms sent to:${mobileNum} failed.`
      }
    }
    return {
      actionResult: false,
      data: false,
      message: `Target sms api uri is empty.`
    }
  },
  ValidateSmsCode: async function (mobile, code) {
    let findResult = await SmsValidationDataRepository.FindValidationByMobile(mobile)
    if (findResult.actionResult) {
      let validationData = findResult.data
      if (validationData.overtime > _.now()) {
        return {
          actionResult: validationData.validationCode === code,
          message: `Validation result is ${validationData.validationCode === code}`,
          data: validationData
        }
      }
      return {
        actionResult: false,
        message: `Validation code is over time.`,
        data: undefined
      }
    }
    return findResult
  },
  FindUserIdByMobile: async function (mobile) {
    let validationData = await SmsValidationDataRepository.FindValidationByMobile(mobile)
    if (validationData.actionResult) {
      return {
        actionResult: true,
        message: `Find validation data by id success.`,
        data: validationData.data.uid
      }
    }
    return {
      actionResult: false,
      message: `Failed to find validation data by id.`,
      data: undefined
    }
  },
  DeleteUserValidationData: async function (userId) {
    return await SmsValidationDataRepository.DeleteValidationsByUserId(userId)
  }
}