const { AdminDataRepository } = require('../DataRepositories')

module.exports = {
  FindAdminById: async function (adminId) {
    return await AdminDataRepository.FindAdminById(adminId)
  }
}