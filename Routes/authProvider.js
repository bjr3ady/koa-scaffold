const crypto = require('crypto')
const { UserService, AdminDataService } = require('../ApplicationService')
const globalConfig = require('../globalConfig.json')
const logger = require('../logger')

let authProvider = {
  GenerateBearerToken: (uid, token, url) => {
    let cr = crypto.createHash('md5')
    let cc = `${url},${uid},${token}`
    cr.update(`${url},${uid},${token}`)
    return cr.digest('hex')
  },
  CheckAuth: async function (ctx) {
    if (globalConfig.USE_AUTH) {
      let authHeaders = ctx.request.req.headers
      if (authHeaders && authHeaders.authorization) {
        let authorization = authHeaders.authorization.split(' ')[1]
        let uid = authHeaders.uid
        let url = ctx.request.href
        if (globalConfig.USE_HTTPS) {
          url = url.replace('http', 'https')
        }
        if (authorization && uid && url) {
          let userData = await UserService.findUserById(uid)
          if (userData.data) {
            let bt = this.GenerateBearerToken(uid, userData.data.token, url)
            if (bt && bt === authorization) {
              return true
            }
          }
        }
      }
      ctx.status = 401
      ctx.body = 'Authorization failed'
      return false
    }
    return true
  },
  CheckAdminAuth: async function (ctx) {
    if (globalConfig.USE_AUTH) {
      let authHeaders = ctx.request.req.headers
      if (authHeaders && authHeaders.authorization) {
        let authorization = authHeaders.authorization.split(' ')[1]
        let adminId = authHeaders.adminid
        let url = ctx.request.href
        if (globalConfig.USE_HTTPS) {
          url = url.replace('http', 'https')
        }
        if (authorization && adminId && url) {
          let adminData = await AdminDataService.FindAdminById(adminId)
          if (adminData.data) {
            let bt = this.GenerateBearerToken(adminId, adminData.data.token, url)
            if (bt === authorization) {
              return true
            }
          }
        }
      }
      ctx.status = 401
      ctx.body = 'Authorization failed'
      return false
    }
    return true
  },
  IsAdminRequest: async function (ctx) {
    let authHeaders = ctx.request.req.headers
    return authHeaders.adminid !== undefined && authHeaders.adminid !== null && authHeaders.adminid !== ''
  },
  SplitUidFromHeader: function (ctx) {
    let authHeaders = ctx.request.req.headers
    if (authHeaders && authHeaders.authorization) {
      let authorization = authHeaders.authorization.split(' ')[1]
      return authHeaders.uid
    }
    return undefined
  }
}
module.exports = authProvider