const asyncBusboy = require('async-busboy')
const { ArchiveService } = require('../ApplicationService')

module.exports = {
  Upload: async function (ctx) {
    let { files } = await asyncBusboy(ctx.req)
    if (files && files.length) {
      let archiveUri = await ArchiveService.SaveFileToServer(files[0], files[0].filename)
      return {
        actionResult: true,
        data: archiveUri,
        message: `Upload archive success.`
      }
    }
    return CommonResult.CreateParameterErrorResult()
  },
  Delete: async function (ctx) {
    let req = ctx.request.body
    if (req && req.uri) {
      return await ArchiveService.DeleteFile(req.uri)
    }
    return CommonResult.CreateParameterErrorResult()
  }
}