const platformConn = require('./platformMongooseConnector')

module.exports = {
  Mongooses: {
    PlatformMongoose: platformConn
  },

  /*****************************Entity Initializer***********************************/
  EntityInitializer: {
    platformEntityMap: [
      { registry: 'User', model: require('./PlatformServerEntities/userEntity') },
      { registry: 'SmsValidation', model: require('./PlatformServerEntities/smsValidationEntity') }
    ],
    initialize: function () {
      this.platformEntityMap.map(function (modelMap) {
        platformConn.model(modelMap.registry, modelMap.model)
      })
    }
  },

  /*****************************Entity Objects***********************************/
  UserEntity: require('./PlatformServerEntities/userEntity')
}