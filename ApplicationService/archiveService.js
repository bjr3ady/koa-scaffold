const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v1')
const globalConfig = require('../globalConfig.json')

const newFileName = (fileName) => {
  let fileSuffix = _.split(fileName, '.', 2)[1]
  return `${uuid()}.${fileSuffix}`
}

module.exports = {
  SaveFileToServer: async function (fileStream, fileName) {
    let filePath = path.resolve(__dirname, '../archives')
    let newName = newFileName(fileName)
    let stream = fs.createWriteStream(`${filePath}/${newName}`)
    await fileStream.pipe(stream)
    return `${globalConfig.API_DOMAIN}/files/${newName}`
  },
  DeleteFile: function (fileUri) {
    let filePath = path.resolve(__dirname, '../archives')
    let fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.length)
    return new Promise( function (resolve, reject) {
      fs.unlink(`${filePath}/${fileName}`, err => {
        if (err) {
          resolve(
          {
            actionResult: false,
            data: err.code,
            message: `Failed to delete file.`
          })
        }
        resolve({
          actionResult: true,
          data: true,
          message: `Delete file success.`
        })
      })
    })
  }
}