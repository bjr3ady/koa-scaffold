let commonActionResult = {
  CreateParameterErrorResult: function () {
    return {
      code: 500,
      message: 'Parameters contains invalid value.',
      data: undefined
    }
  }
}
module.exports = commonActionResult