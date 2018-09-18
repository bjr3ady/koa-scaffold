const { UserService } = require('../ApplicationService')
const CommonResult = require('./commonResult')

let userController = {
  HasUser: async function (ctx) {
    let req = ctx.params
    if (req && req.mobile) {
      let findResult = await UserService.FindUserByMobile(req.mobile)
      if (findResult.actionResult && findResult.data) {
        return {
          actionResult: true,
          data: true,
          message: `User exists.`
        }
      }
      return {
        actionResult: true,
        data: false,
        message: `User does not exists.`
      }
    }
    return CommonResult.CreateParameterErrorResult()
  },
  PreRegister: async function (ctx) {
    let req = ctx.request.body
    if (req && req.mobile) {
      let registerResult = await UserService.PreRegisterByMobile(req.mobile)
      return registerResult
    }
    return CommonResult.CreateParameterErrorResult()
  },
  Register: async function (ctx) {
    let req = ctx.request.body
    if (req && req.mobile && req.code) {
      let registerResult = await UserService.RegisterByMobile(req.mobile, req.code)
      if (registerResult.actionResult) {
        return {
          actionResult: true,
          message: `Register new user ${req.mobile} success.`,
          data: {
            uid: registerResult.data.uid,
            token: registerResult.data.token,
            tokenExpire: registerResult.data.tokenExpire
          }
        }
      }
      return {
        actionResult: false,
        message: registerResult.message,
        data: undefined
      }
    }
    return CommonResult.CreateParameterErrorResult()
  },
  PreLogin: async function (ctx) {
    let req = ctx.request.body
    if (req && req.mobile) {
      return await UserService.PreLoginByMobile(req.mobile)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  LoginByMobileWithSmsCode: async function (ctx) {
    let req = ctx.request.body
    if (req && req.mobile && req.code) {
      let loginResult = await UserService.LoginByMobile(req.mobile, req.code)
      if (loginResult.actionResult) {
        return {
          actionResult: true,
          message: `User ${req.mobile} login success.`,
          data: {
            uid: loginResult.data.uid,
            token: loginResult.data.token,
            tokenExpire: loginResult.data.tokenExpire
          }
        }
      }
      return loginResult
    }
    return CommonResult.CreateParameterErrorResult()
  },
  LoginByPassword: async function (ctx) {
    let req = ctx.request.body
    if (req && req.mobile && req.pwd) {
      let loginResult = await UserService.LoginByPassword(req.mobile, req.pwd)
      if (loginResult.actionResult) {
        return {
          actionResult: true,
          message: `User ${req.mobile} login success.`,
          data: {
            uid: loginResult.data.uid,
            token: loginResult.data.token,
            tokenExpire: loginResult.data.tokenExpire
          }
        }
      }
      return loginResult
    }
    return CommonResult.CreateParameterErrorResult()
  },
  CheckToken: async function (ctx) {
    let req = ctx.request.body
    if (req && req.uid && req.token) {
      return await UserService.CheckToken(req.uid, req.token)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  FindUserById: async function (ctx) {
    let req = ctx.params
    if (req && req.id) {
      return await UserService.FindUserById(req.id)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  UpdateUserPasswordWithSMSAuth: async function (ctx) {
    let mobile = ctx.params.mobile
    let password = ctx.request.body.password
    let code = ctx.request.body.code
    if (mobile && password && code) {
      return await UserService.ChangeUserPasswordWithSMSAuth(mobile, password, code)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  UpdateUserPassword: async function (ctx) {
    let userId = ctx.params.id
    let password = ctx.request.body.password
    if (userId && password) {
      return await UserService.ChangeUserPassword(userId, password)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  AllUsers: async function (ctx) {
    let req = ctx.request.query
    if (req && req.startIndex && req.count) {
      return await UserService.AllUsers(req.startIndex * 1, req.count * 1)
    }
    return CommonResult.CreateParameterErrorResult()
  },
  DeleteUser: async function (ctx) {
    let userId = ctx.params.id
    if (userId) {
      return await UserService.Delete(userId)
    }
    return CommonResult.CreateParameterErrorResult()
  }
}
module.exports = userController