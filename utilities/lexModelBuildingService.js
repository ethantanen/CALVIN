const AWS = require('aws-sdk')

const lexModelBuilder = new AWS.LexModelBuildingService({
  apiVersion: '2017-04-19'
})

/**
 * NOTE: the zipped json archive of the bot can be located
 * at the url in the data param for the callback
 */

// Export a bot
function getExport (botName, botVersion) {
  let params = {
    exportType: 'LEX',
    name: botName,
    resourceType: 'BOT',
    version: botVersion
  }
  return new Promise((resolve, reject) => {
    lexModelBuilder.getExport(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// NOTE: bot should be buffer or base64 encoded string
// Start import bot
function startImport (bot) {
  let params = {
    mergeStrategy: 'OVERWRITE_LATEST',
    payload: bot,
    resourceType: 'BOT'
  }
  return new Promise((resolve, reject) => {
    lexModelBuilder.startImport(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get imported bots information
function getImport (importId) {
  let params = {
    importId: importId
  }
  return new Promise((resolve, reject) => {
    lexModelBuilder.getImport(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}
