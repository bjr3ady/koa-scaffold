const _ = require('lodash')
const crypto = require('crypto')
const uuid = require('uuid/v1')
const globalConfig = require('../globalConfig.json')
const { UserDataRepository } = require('../DataRepositories')
const SmsService = require('./smsService')

const createPassword = function (passwordStr) {
  let cr = crypto.createHash('md5')
  if (cr) {
    cr.update(passwordStr)
    let result = cr.digest('hex')
    return result
  }
  return ''
}

module.exports = {
  changeUserToken: async function (mobile) {
    let findResult = await UserDataRepository.FindUserByMobile(mobile)
    if (findResult.actionResult) {
      let userData = findResult.data
      let tokenExpire = _.now() + globalConfig.USER_TOKEN_EXPIRE
      let updateResult = await UserDataRepository.UpdateUser(
        userData.uid,
        null,
        uuid(),
        tokenExpire,
        null,
        null,
        null,
        null,
        null)
      return updateResult
    }
    return findResult
  },
  PreRegisterByMobile: async function (mobile) {
    let findResult = await UserDataRepository.FindUserByMobile(mobile)
    if (findResult.actionResult) {
      return {
        actionResult: false,
        message: `Current mobile: ${mobile} already registered.`,
        data: false
      }
    }

    let userId = `u_${mobile}`
    let deleteValiResult = await SmsService.DeleteUserValidationData(userId)
    if (deleteValiResult.actionResult) {
      let valiCode = _.random(100000, 999999)
      return SmsService.SendSmsCode(valiCode, userId, mobile)
    }
    return deleteValiResult
  },
  RegisterByMobile: async function (mobile, code) {
    let isCodeValid = await SmsService.ValidateSmsCode(mobile, code)
    if (isCodeValid.actionResult) {
      let uidResult = await SmsService.FindUserIdByMobile(mobile)
      if (uidResult.actionResult) {
        let uid = uidResult.data
        let deleteResult = await SmsService.DeleteUserValidationData(uid)
        if (!deleteResult.actionResult) {
          return deleteResult
        }

        let createResult = await UserDataRepository.CreateNewUser(
          uid,
          `user_${mobile}`,
          uuid(),
          _.now() + globalConfig.USER_TOKEN_EXPIRE,
          mobile,
          '',
          createPassword(uid)
        )
        if (!createResult.actionResult) {
          return createResult
        }
        return createResult
      }
      return uidResult
    }
    return isCodeValid
  },
  PreLoginByMobile: async function (mobile) {
    let findResult = await UserDataRepository.FindUserByMobile(mobile)
    if (findResult.actionResult) {
      let userData = findResult.data
      let deleteValiResult = await SmsService.DeleteUserValidationData(userData.uid)
      if (deleteValiResult.actionResult) {
        let valiCode = _.random(100000, 999999)
        return SmsService.SendSmsCode(valiCode, userData.uid, mobile)
      }
      return deleteValiResult
    }
    return findResult
  },
  LoginByMobile: async function (mobile, code) {
    let isCodeValid = await SmsService.ValidateSmsCode(mobile, code)
    if (isCodeValid.actionResult) {
      let uidResult = await SmsService.FindUserIdByMobile(mobile)
      if (uidResult.actionResult) {
        let uid = uidResult.data
        let deleteResult = await SmsService.DeleteUserValidationData(uid)
        if (!deleteResult.actionResult) {
          return deleteResult
        }

        return this.changeUserToken(mobile)
      }
      return uidResult
    }
    return isCodeValid
  },
  LoginByPassword: async function (mobile, password) {
    let findUserResult = await UserDataRepository.FindUserByMobile(mobile)
    if (findUserResult.actionResult) {
      let userData = findUserResult.data
      if (userData.pwd === createPassword(password)) {
        return this.changeUserToken(mobile)
      }
      return {
        actionResult: false,
        data: undefined,
        message: `Login failed.`
      }
    }
    return findUserResult
  },
  ChangeUserPasswordWithSMSAuth: async function (mobile, password, code) {
    let findResult = await UserDataRepository.FindUserByMobile(mobile)
    let uid = `u_${mobile}`
    if (!findResult.actionResult) {
      let createResult = await UserDataRepository.CreateNewUser(
        uid,
        `g_${mobile}`,
        `user_${mobile}`,
        uuid(),
        _.now() + globalConfig.USER_TOKEN_EXPIRE,
        mobile,
        '',
        '',
        createPassword(uid)
      )
      if (!createResult.actionResult) {
        return createResult
      }
    }
    let isCodeValid = await SmsService.ValidateSmsCode(mobile, code)
    if (!isCodeValid.actionResult) {
      return isCodeValid
    }
    let deleteResult = await SmsService.DeleteUserValidationData(uid)
    if (!deleteResult.actionResult) {
      return deleteResult
    }
    
    let updateResult = await UserDataRepository.UpdateUser(
      uid,
      null,
      null,
      null,
      null,
      null,
      null,
      createPassword(password),
      null)
    if (!updateResult.actionResult) {
      return updateResult
    }
    let changeResult = await this.changeUserToken(mobile)
    if (changeResult.actionResult) {
      return {
        actionResult: changeResult.actionResult,
        message: `Change password success.`,
        data: {
          uid: changeResult.data.uid,
          token: changeResult.data.token
        }
      }
    }
    return changeResult
  },
  ChangeUserPassword: async function (userId, password) {
    let findResult = await UserDataRepository.FindUserById(userId)
    if (!findResult.actionResult) {
      return findResult
    }
    let userData = findResult.data
    let updateResult = await UserDataRepository.UpdateUser(
      userId,
      null,
      null,
      null,
      null,
      null,
      null,
      createPassword(password),
      null)
    if (!updateResult.actionResult) {
      return updateResult
    }
    let changeResult = await this.changeUserToken(userData.mobile)
    if (changeResult.actionResult) {
      return {
        actionResult: changeResult.actionResult,
        message: `Change user: ${userData.uid} password success.`
      }
    }
    return changeResult
  },
  FindUserById: function (userId) {
    return UserDataRepository.FindUserById(userId)
  },
  FindUserByMobile: function (mobile) {
    return UserDataRepository.FindUserByMobile(mobile)
  },
  AllUsers: async function (startIndex, count) {
    return await UserDataRepository.FindAllUsers(startIndex, count)
  },
  Delete: async function (userId) {
    let tasks = []
    
    tasks.push(UserDataRepository.DeleteUser(userId))
    return Promise.all(tasks)
  }
}