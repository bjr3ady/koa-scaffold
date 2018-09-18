const _ = require('lodash')
const { Mongooses } = require('../Entities')
let UserEntity = Mongooses.PlatformMongoose.model('User')

module.exports = {
  CreateNewUser: async function (uid, gid, name, token, tokenExpire, mobile, wechatOpenId, email, pwd) {
    let userEntity = new UserEntity({
      uid: uid,
      gid: gid,
      wechat_openid: wechatOpenId,
      name: name,
      token: token,
      tokenExpire: tokenExpire,
      mobile: mobile,
      email: email,
      pwd: pwd
    })
    let createResult = await userEntity.save()
    if (createResult) {
      return {
        actionResult: true,
        message: `Save new created user to db success.`,
        data: createResult
      }
    }
    return {
      actionResult: false,
      message: `Failed to save new created user to db.`,
      data: undefined
    }
  },
  UpdateUser: async function (uid, name, token, tokenExpire, avatar, mobile, email, pwd, isBlocked) {
    let updates = {
      name: name,
      token: token,
      tokenExpire: tokenExpire,
      avatar: avatar,
      mobile: mobile,
      email: email,
      pwd: pwd,
      isBlocked: isBlocked
    }
    if (!name) {
      delete updates.name
    }
    if (!token) {
      delete updates.token
    }
    if (!tokenExpire) {
      delete updates.tokenExpire
    }
    if (!avatar) {
      delete updates.avatar
    }
    if (!mobile) {
      delete updates.mobile
    }
    if (!email) {
      delete updates.email
    }
    if (!pwd) {
      delete updates.pwd
    }
    if (!isBlocked) {
      delete updates.isBlocked
    }
    let userEntity = await UserEntity.findOneAndUpdate({uid: uid}, updates).exec()
    if (userEntity) {
      let newUserEntity = await UserEntity.findOne({uid: uid}).exec()
      return {
        actionResult: true,
        message: `Find user by id:${uid} and update success.`,
        data: newUserEntity
      }
    }
    return {
      actionResult: false,
      message: `Faile to find user by id: ${uid}.`,
      data: undefined
    }
  },
  FindUserById: async function (userId) {
    let userEntity = await UserEntity.findOne({uid: userId}).exec()
    if (userEntity) {
      return {
        actionResult: true,
        message: `Find user by id: ${userId} success.`,
        data: userEntity
      }
    }
    return {
      actionResult: false,
      message: `Failed to find user by id: ${userId}`,
      data: undefined
    }
  },
  FindUserByMobile: async function (mobile) {
    let userEntity = await UserEntity.findOne({mobile: mobile}).exec()
    if (userEntity) {
      return {
        actionResult: true,
        message: `Find user by mobile: ${mobile} success.`,
        data: userEntity
      }
    }
    return {
      actionResult: false,
      message: `Failed to find user by mobile: ${mobile}`,
      data: undefined
    }
  },
  FindAllUsers: async function (startIndex, count) {
    let usersData = await UserEntity.find({}).limit(count).skip(startIndex * count).exec()
    let userCount = await UserEntity.find({}).count().exec()
    if (usersData) {
      return {
        actionResult: true,
        data: {usersData, count: userCount},
        message: `Find all users success.`
      }
    }
    return {
      actionResult: false,
      data: undefined,
      message: `Failed to find all users.`
    }
  },
  DeleteUser: async function (userId) {
    let deleteResult = await UserEntity.findOneAndRemove({uid: userId}).exec()
    if (deleteResult) {
      return {
        actionResult: true,
        data: deleteResult,
        message: `Delete user: ${userId} success.`
      }
    }
    return {
      actionResult: false,
      data: undefined,
      message: `Delete user: ${userId} failed.`
    }
  }
}