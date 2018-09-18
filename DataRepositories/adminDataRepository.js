const { Mongooses } = require('../Entities')
const AdminEntity = Mongooses.PlatformMongoose.model('AdminData')

module.exports = {
  FindAdminById: async function (adminId) {
    let adminEntity = await AdminEntity.findOne({admin_id: adminId}).exec()
    if (adminEntity) {
      return {
        actionResult: true,
        message: `Find admin by id: ${adminId} success.`,
        data: adminEntity
      }
    }
    return {
      actionResult: false,
      message: `Failed to find user by id: ${adminId}`,
      data: undefined
    }
  }
}